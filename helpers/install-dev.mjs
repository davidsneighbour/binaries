#!/usr/bin/env node

import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { spawnSync } from "node:child_process";
import toml from "toml";

// Function to display help
function showHelp() {
  console.log(`
Usage: node runPrograms.mjs [options]

Options:
  --config <path>  Path to the TOML configuration file (default: ./install-dev.toml)
  --help           Show this help message and exit
  `);
  process.exit(0);
}

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command-line arguments
const args = process.argv.slice(2);
let configPath = join(__dirname, "install-dev.toml");
if (args.includes("--help")) {
  showHelp();
}
if (args.includes("--config")) {
  const configIndex = args.indexOf("--config");
  if (configIndex !== -1 && args[configIndex + 1]) {
    configPath = args[configIndex + 1];
  } else {
    console.error("Error: --config option requires a path argument.");
    process.exit(1);
  }
}

// Load and parse the TOML configuration file
let config;
try {
  const tomlContent = fs.readFileSync(configPath, "utf8");
  config = toml.parse(tomlContent);
} catch (error) {
  console.error("Error reading or parsing the TOML file:", error.message);
  process.exit(1);
}

// Run selected commands synchronously with error handling
function runSelectedCommands(selectedCommands) {
  for (const command of selectedCommands) {
    const result = spawnSync(command, {
      stdio: "inherit",
      shell: true,
    });

    if (result.status !== 0) {
      console.error(`Error executing: ${command}`);
      process.exit(result.status ?? 1);
    }
  }
}

async function main() {
  intro("Install Dev Environment");

  // Prepare the selection options from the config
  const options = config.tool.map((tool) => ({
    label: tool.label,
    value: tool.exec,
  }));

  const selectedCommands = await multiselect({
    message: "Select programs to run:",
    options,
  });

  if (isCancel(selectedCommands)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  if (selectedCommands.length === 0) {
    outro("No programs selected.");
    process.exit(0);
  }

  const confirmRun = await confirm({
    message: "Do you want to run the selected programs?",
  });

  if (!confirmRun) {
    outro("Operation cancelled.");
    process.exit(0);
  }

  const s = spinner();
  s.start("Executing");

  runSelectedCommands(selectedCommands);

  s.stop("Done");
  outro("All selected programs executed successfully.");
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error.message);
  process.exit(1);
});
