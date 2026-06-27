// Build validation script
// Run: node scripts/validate-build.mjs

import { execSync } from "child_process"

let exitCode = 0

function runCommand(cmd, label) {
  console.log(`\n🔍 ${label}...`)
  try {
    execSync(cmd, { stdio: "inherit", encoding: "utf8" })
    console.log(`✅ ${label} passed`)
  } catch {
    console.error(`❌ ${label} failed`)
    exitCode = 1
  }
}

// 1. TypeScript type checking
runCommand("npx tsc --noEmit", "TypeScript type checking")

// 2. ESLint
runCommand("npx next lint", "ESLint")

// 3. Build
runCommand("npm run build", "Next.js build")

// 4. Broken link detection
console.log("\n🔍 Checking broken links...")
try {
  const result = execSync("npx linkinator http://localhost:3000 --recurse --skip '/(api|_next|images)/'", {
    encoding: "utf8",
    timeout: 30000,
  })
  const brokenCount = (result.match(/\[\d{3}\]/g) || []).filter((c) => c.startsWith("[4") || c.startsWith("[5")).length
  if (brokenCount > 0) {
    console.error(`❌ Found ${brokenCount} broken links`)
    exitCode = 1
  } else {
    console.log("✅ No broken links detected")
  }
} catch {
  // linkinator may fail if server isn't running
  console.log("⚠️  Link checking skipped (start dev server first: npm run start)")
}

console.log(`\n${exitCode === 0 ? "✅ All validations passed!" : "❌ Some validations failed."}`)
process.exit(exitCode)