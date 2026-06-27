// Metadata and route validation script
// Checks that all pages have required metadata

import { readFileSync, existsSync } from "fs"
import { globSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, "../src/app")

function checkPageMetadata(filePath) {
  const content = readFileSync(filePath, "utf8")
  const issues = []

  if (!content.includes("export const metadata") && !content.includes("export async function generateMetadata")) {
    issues.push("Missing metadata export")
  }

  if (!content.includes('"use client"')) {
    if (!content.includes("export default")) {
      issues.push("Missing default export")
    }
  }

  return issues
}

const pages = globSync(`${srcDir}/**/page.tsx`)
let totalIssues = 0

console.log("🔍 Validating page metadata and structure...")
console.log(`Found ${pages.length} page files\n`)

for (const page of pages) {
  const relativePath = path.relative(srcDir, page)
  const issues = checkPageMetadata(page)
  if (issues.length > 0) {
    console.log(`❌ ${relativePath}:`)
    issues.forEach((i) => console.log(`   - ${i}`))
    totalIssues += issues.length
  } else {
    console.log(`✅ ${relativePath}`)
  }
}

console.log(`\n${totalIssues === 0 ? "✅ All pages have valid metadata!" : `❌ ${totalIssues} issues found.`}`)
process.exit(totalIssues > 0 ? 1 : 0)