#!/bin/bash

set -euo pipefail  # Exit on error, undefined var, or pipe failure

function usage() {
  cat <<EOF
Usage: ${FUNCNAME[0]} --owner <GitHub-Owner> --repo <GitHub-Repo>

Options:
  --owner   GitHub repository owner (required)
  --repo    GitHub repository name (required)
  --help    Show this help message and exit
EOF
}

# Parse arguments
owner=""
repo=""
if [[ $# -eq 0 ]]; then
  usage
  exit 1
fi

while [[ $# -gt 0 ]]; do
  case "${1}" in
    --owner)
      owner="${2-}"
      shift 2
      ;;
    --repo)
      repo="${2-}"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Error: Unknown option: ${1}" >&2
      usage
      exit 1
      ;;
  esac
done

# Verify GitHub CLI is installed
if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is not installed. Please install it from https://cli.github.com/" >&2
  exit 1
fi

# Validate required parameters
if [[ -z "${owner}" || -z "${repo}" ]]; then
  echo "Error: Both --owner and --repo are required." >&2
  usage
  exit 1
fi

# Fetch and delete all workflow runs
echo "Fetching workflow runs for ${owner}/${repo}..."
workflow_runs=$(gh api "repos/${owner}/${repo}/actions/runs" --paginate --jq '.workflow_runs[].id')

for run_id in ${workflow_runs}; do
  echo "Deleting workflow run ID: ${run_id}"
  gh api "repos/${owner}/${repo}/actions/runs/${run_id}" -X DELETE
done

echo "All workflow runs have been deleted."
