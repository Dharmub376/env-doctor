import fs from "fs";
import { config as loadEnvFile } from "dotenv";
import { spawnSync } from "child_process";

if (!fs.existsSync(".env.local")) {
  // Something is off, skip the script.
  process.exit(0);
}

const config = {};
loadEnvFile({ path: ".env.local", processEnv: config });

const runOnceWorkflow = process.argv.includes("--once");

if (runOnceWorkflow && config.SETUP_SCRIPT_RAN !== undefined) {
  // The script has already ran once, skip.
  process.exit(0);
}

const result = spawnSync("npx", ["@convex-dev/auth", "--skip-git-check"], {
  stdio: "inherit",
});

if (runOnceWorkflow) {
  fs.writeFileSync(".env.local", `
SETUP_SCRIPT_RAN=1
`, { flag: "a" });
}


process.exit(result.status);