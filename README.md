![hugo-bin](.github/github-card-dark.png#gh-dark-mode-only)
![hugo-bin](.github/github-card-light.png#gh-light-mode-only)

This is a highly experimental project at the moment and tries to combine and normalise the build system across all `@davidsneighbour/*` projects. Use with caution. Don't blame me if it breaks everything ;) Once I have a version that I trust it will reach v1.0.0.

## Principal mode of operation

The scripts are contained in a `bin` directory and have a structured setup with helpers and scripts and an overall uniform way of function. The `bin` folder should be added to the repository that is using the scripts, as a folder, not a submodule. Updating overrides the existing files and can commit updates to the repository.

## Installation (TBD)

Note that this will override files in `bin`. Commit all files in `bin` before installing/updating so you have something to `git diff` against at first install.

```bash
sh -c "$(curl -sSL https://raw.githubusercontent.com/davidsneighbour/binaries/main/install)"
```

## Update (TBD)

Run `bin/self/update`. Then check with `git diff` what's changed (or subscribe to [releases on GitHub](https://github.com/davidsneighbour/binaries/releases)).
