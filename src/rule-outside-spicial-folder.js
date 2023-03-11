const path = require('path');
const minimatch = require('minimatch');

module.exports = {
  create(context) {
    const options = context.options[0] || {};
    const directories = options.directories;
    const ignore = options.ignore;

    if (!directories) {
      throw new Error('Missing required option "directories"');
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
        const sourcePath = path.resolve(filename, '..', source);

        directoriesData.forEach((info) => {
          const directoryPath = info.directoryPath;
          const directoryName = info.directoryName;

          const isIgnoredFolder = ignorePaths.some((path) => (
            minimatch(sourcePath, path)
          ));

          if (isIgnoredFolder) {
            return;
          }

          if (filename.includes(directoryName) && !sourcePath.startsWith(directoryPath)) {
            context.report({
              node,
              message: `Importing file outside of ${directoryName} is not allowed.`,
            });
          }
        });
      },
    };
  },
};
