#!/bin/bash

# Function to generate release notes using commit-and-tag-version
# Stores the release notes in RELEASE_NOTES and writes them to changes.md
create_changelog() {
  # Use externally defined verbose variable, default to 'false' if not set
  local is_verbose="${verbose:-false}"

  # Generate the release notes by filtering commit-and-tag-version dry-run output
  local release_notes
  release_notes=$(npx commit-and-tag-version --dry-run 2>/dev/null | \
    sed -r 's/\x1B\[[0-9;]*[mK]//g' | \
    awk 'BEGIN { flag=0 } /^---$/ { if (flag == 0) { flag=1 } else { flag=2 }; next } flag == 1')

  # Check if release notes were successfully generated
  if [ -n "$release_notes" ]; then
    RELEASE_NOTES="$release_notes"

    # Save release notes to changes.md
    echo "$RELEASE_NOTES" >changes.md

    # Verbose logging
    if [ "$is_verbose" == "true" ]; then
      echo "Release notes generated and saved to changes.md:"
      echo "$RELEASE_NOTES"
      code changes.md
    fi
  else
    echo "Error: Failed to generate release notes using commit-and-tag-version."
    return 1
  fi
}

# # Example usage
# # Set verbosity
# verbose=true

# # Call the function
# generate_release_notes

# # Check and use the RELEASE_NOTES variable
# if [ -n "$RELEASE_NOTES" ]; then
#   echo "Release notes successfully generated."
# else
#   echo "No release notes could be generated."
# fi
