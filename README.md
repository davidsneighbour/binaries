![hugo-bin](.github/github-card-dark.png#gh-dark-mode-only)
![hugo-bin](.github/github-card-light.png#gh-light-mode-only)

This is a highly experimental project at the moment and tries to combine and normalise the build system across all `@davidsneighbour/*` projects. Use with caution. Don't blame me if it breaks everything ;) Once I have a version that I trust it will reach v1.0.0.

## Principal mode of operation

The scripts are contained in a `bin` directory and have a structured setup with helpers and scripts and an uniform way of function. The `bin` folder should be added to the repository that is using the scripts, as a folder, not a submodule. Updating overrides the existing files and can commit updates to the repository.

## Installation

```bash
git submodule add git@github.com:davidsneighbour/binaries.git bin
```

If you've already cloned a repository without its submodules, you can initialize and update them with:

```bash
git submodule update --init --recursive
```

## ENV variables

Set them either in $HOME directory or in the root of the repository in an `.env` file.

```bash
GITHUB_USER=davidsneighbour # Your GitHub username
```

## Development

Set up a symlink to the `bin` directory in the root of the repository:

```bash
ln -s . bin
```
