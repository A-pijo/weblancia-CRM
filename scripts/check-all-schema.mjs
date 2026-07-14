import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: join(process.cwd(), '.env.local') });

// Dynamically import pg
const { Client } = await import('pg');

// ── Parse Prisma schema ──────────────────────────────────────
function parseSchema(schemaPath) {
  const raw = readFileSync(schemaPath, 'utf-8');
  const models = {};

  // Remove line comments
  const cleaned = raw.replace(/\/\/[^\n]*/g, '');

  // Match model blocks
  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let match;

  // First pass: collect all model names (these are relation types)
  const modelNames = new Set();
  const mRegex = /model\s+(\w+)\s*\{/g;
  let mm;
  while ((mm = mRegex.exec(cleaned)) !== null) {
    modelNames.add(mm[1]);
  }

  // Second pass: extract fields
  while ((match = modelRegex.exec(cleaned)) !== null) {
    const modelName = match[1];
    const body = match[2];

    const fields = {};
    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      // Skip directives, relations, empty lines
      if (line.startsWith('@@') || line.startsWith('//') || line.startsWith('@relation') || line === '') continue;
      if (line.includes('@relation')) continue;

      // Match: fieldName Type [optional modifiers]
      const fieldMatch = line.match(/^(\w+)\s+(\S+)/);
      if (fieldMatch) {
        const [, name, rawType] = fieldMatch;

        // Extract the base Prisma type
        let typeStr = rawType.replace('?', '').replace('[]', '');

        // If it's a model name (relation type), skip it
        if (modelNames.has(typeStr)) continue;

        // If it contains @db, strip it
        const dbMatch = typeStr.match(/^(\w+)/);
        if (dbMatch) {
          fields[name] = dbMatch[1];
        }
      }
    }
    models[modelName] = fields;
  }

  return models;
}

// ── Prisma type → expected Postgres type (approximate) ───────
const prismaToPostgres = {
  'String': 'text',
  'Boolean': 'boolean',
  'Int': 'integer',
  'Float': 'double precision',
  'Json': 'jsonb',
  'DateTime': 'timestamp',
  'Decimal': 'numeric',
};

function prismaTypeToPg(prismaType) {
  if (prismaType === 'String') return 'text';
  if (prismaType === 'Boolean') return 'boolean';
  if (prismaType === 'Int') return 'integer';
  if (prismaType === 'Float') return 'double precision';
  if (prismaType === 'Json') return 'jsonb';
  if (prismaType === 'DateTime') return 'timestamp';
  if (prismaType === 'Decimal') return 'numeric';
  return 'text';
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma');
  const models = parseSchema(schemaPath);

  console.log(`Parsed ${Object.keys(models).length} models from Prisma schema:\n`);
  console.log(Object.keys(models).join(', '));
  console.log('');

  // Connect to DB using DIRECT_URL
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('No DATABASE_URL or DIRECT_URL found in .env.local');
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    // Get all tables in public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    const dbTables = tablesRes.rows.map(r => r.table_name);

    console.log(`Database tables in public schema (${dbTables.length}):\n`);
    console.log(dbTables.join(', '));
    console.log('');

    // Get all columns
    const colsRes = await client.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);

    const dbColumns = {};
    for (const row of colsRes.rows) {
      if (!dbColumns[row.table_name]) dbColumns[row.table_name] = {};
      dbColumns[row.table_name][row.column_name] = {
        dataType: row.data_type,
        udtName: row.udt_name,
        isNullable: row.is_nullable === 'YES',
        columnDefault: row.column_default,
      };
    }

    const mismatches = [];

    // Compare each Prisma model against DB
    for (const [modelName, schemaFields] of Object.entries(models)) {
      // Prisma uses snake_case by default unless @@map is used
      // Check if there's a @@map directive
      let tableName = modelName;

      const dbCols = dbColumns[modelName];

      if (!dbCols) {
        // Table doesn't exist in DB — could be mapped via @@map
        // Try to find the table
        const possibleTables = dbTables.filter(t =>
          t.toLowerCase() === modelName.toLowerCase() ||
          t.toLowerCase() === modelName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
        );
        if (possibleTables.length > 0) {
          tableName = possibleTables[0];
        } else {
          mismatches.push(`TABLE MISSING: Model "${modelName}" has no corresponding table in database`);
          continue;
        }
      }

      const actualCols = dbColumns[tableName] || {};

      // Check for missing columns (in schema but not in DB)
      for (const [fieldName, fieldType] of Object.entries(schemaFields)) {
        if (!actualCols[fieldName]) {
          mismatches.push(`COLUMN MISSING: ${modelName}.${fieldName} (${fieldType}) — not found in table "${tableName}"`);
        }
      }

      // Check for extra columns (in DB but not in schema)
      const schemaFieldNames = new Set(Object.keys(schemaFields));
      for (const [colName, colInfo] of Object.entries(actualCols)) {
        if (!schemaFieldNames.has(colName)) {
          mismatches.push(`EXTRA COLUMN: ${modelName}.${colName} (${colInfo.dataType}) — exists in DB but not in schema`);
        }
      }
    }

    // Check for DB tables not in any Prisma model
    const schemaTableNames = new Set(Object.keys(models));
    const schemaTablesLower = new Set([
      ...schemaTableNames,
      ...[...schemaTableNames].map(n => n.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''))
    ]);
    for (const dbTable of dbTables) {
      if (!schemaTablesLower.has(dbTable) && !schemaTableNames.has(dbTable)) {
        mismatches.push(`EXTRA TABLE: "${dbTable}" exists in DB but not in Prisma schema`);
      }
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  SCHEMA vs DATABASE MISMATCH REPORT');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    if (mismatches.length === 0) {
      console.log('  ✅ NO MISMATCHES FOUND — Schema and database are in sync!');
    } else {
      console.log(`  Total mismatches found: ${mismatches.length}`);
      console.log('');
      for (const m of mismatches) {
        console.log(`  • ${m}`);
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');

  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
