#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Function to show help message
const showHelp = () => {
  console.log(`
Usage:
  node manage-frontmatter.mjs --folder=content --key=PARAM --value=NEWVALUE

Options:
  --folder=<path>   Directory to scan for Markdown files (default: 'content')
  --key=<param>     Frontmatter key to add/update
  --value=<value>   New value for the frontmatter key
  --help            Show this help message

Examples:
  node manage-frontmatter.mjs --folder=content/blog --key=fmContentType --value=blog
  node manage-frontmatter.mjs --key=author --value="John Doe"
    `);
  process.exit(0);
};

// Parse CLI arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split("=");
  acc[key.replace("--", "")] = value;
  return acc;
}, {});

// Show help if `--help` is passed or if no required parameters are given
if (args.help || !args.key || !args.value) {
  showHelp();
}

const baseFolder = args.folder || "content";
const keyToUpdate = args.key;
const newValue = args.value;

// Function to check if a package is installed
const isPackageInstalled = async (packageName) => {
  try {
    await import(packageName);
    return true;
  } catch (e) {
    return false;
  }
};

// Ensure gray-matter is installed
const packageName = "gray-matter";

isPackageInstalled(packageName).then(async (installed) => {
  if (!installed) {
    console.error(`\n⚠️  The package '${packageName}' is not installed.\n`);
    process.stdout.write("Would you like to install it now? (y/n) ");

    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (answer) => {
      answer = answer.trim().toLowerCase();
      if (answer === "y") {
        console.log(`\nInstalling ${packageName}...\n`);
        try {
          execSync(`npm install ${packageName}`, { stdio: "inherit" });
          console.log(
            `\n✅ ${packageName} installed. Please run the script again.\n`,
          );
        } catch (err) {
          console.error(`\n❌ Failed to install ${packageName}. Exiting.\n`);
        }
      } else {
        console.log(
          `\n❌ ${packageName} is required to run this script. Exiting.\n`,
        );
      }
      process.exit();
    });

    process.stdin.resume();
  } else {
    const { default: matter } = await import(packageName);

    /**
     * Recursively traverses directories and updates Markdown frontmatter
     * @param {string} dir - Directory to start traversal
     */
    const processDirectory = (dir) => {
      fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          processDirectory(fullPath);
        } else if (file.endsWith(".md")) {
          updateFrontmatter(fullPath);
        }
      });
    };

    /**
     * Reads a markdown file, updates its frontmatter, and saves changes.
     * @param {string} filePath - Path to the markdown file
     */
    const updateFrontmatter = (filePath) => {
      const content = fs.readFileSync(filePath, "utf8");
      const parsed = matter(content);

      // Update the given key with the new value
      parsed.data[keyToUpdate] = newValue;

      // Convert back to markdown format
      const updatedContent = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, updatedContent, "utf8");

      console.log(`Updated ${filePath}: Set '${keyToUpdate}' to '${newValue}'`);
    };

    // Start processing
    console.log(`Scanning folder: ${baseFolder}`);
    processDirectory(baseFolder);
    console.log("Update complete.");
  }
});
