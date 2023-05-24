const path = require('path');
const { minimatch } = require('minimatch');

module.exports = {
  create(context) {
    const { directories, ignore, aliases } = context.options[0] || {};

    if (!directories) {
      throw new Error('Missing required option "directories"');
    }

    if (aliases && !Array.isArray(aliases)) {
      throw new Error('"aliases" must be an array');
    }

    const directoriesData = directories.map((directory) => {
      const directoryPath = path.resolve(directory);
      const directoryName = path.basename(directoryPath);

      return {
        directoryPath,
        directoryName,
      };
    });

    const ignorePaths = Array.isArray(ignore)
      ? ignore.map((pattern) => path.resolve(pattern))
      : [];

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (!source) {
          return;
        }

        const filename = context.getFilename();
        const sourcePath = getSourcePath(aliases, source, filename);

        directoriesData.forEach(({ directoryPath, directoryName }) => {
          const isIgnoredFolder = ignorePaths.some((path) => (
            minimatch(sourcePath, path, { allowWindowsEscape: false })
          ));

          if (isIgnoredFolder) {
            return;
          }

          if (filename.startsWith(directoryPath) && !sourcePath.startsWith(directoryPath)) {
            context.report({
              node,
              message: `Importing file outside ${directoryName} is not allowed.`,
            });
          }
        });
      },
    };
  },
};

function getSourcePath(aliases, source, filename) {
  const maybeAlias = !source.startsWith('.') && aliases;

  return path.resolve(filename, '..', maybeAlias ? resolveAlias(aliases, source) : source);
}

function resolveAlias(aliases, importPath) {
  for (let i = 0; i < aliases.length; i++) {
    const { alias, pathToFolder } = aliases[i];

    if (typeof alias !== 'string' || typeof pathToFolder !== 'string') {
      throw new Error('The aliases array must contain an object with `alias` and `pathToFolder` keys. They should be strings.');
    }

    if (importPath.startsWith(alias)) {
      return path.resolve(importPath.replace(alias, pathToFolder));
    }
  }

  return importPath;
}
