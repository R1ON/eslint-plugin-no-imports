# eslint-plugin-no-imports
[![npm](https://img.shields.io/npm/v/eslint-plugin-no-imports.svg)](https://www.npmjs.com/package/eslint-plugin-no-imports)
[![NPM total downloads](https://img.shields.io/npm/dt/eslint-plugin-no-imports.svg?style=flat)](https://npmjs.org/package/eslint-plugin-no-imports)

An eslint rule to protect your modules from bad imports.
It prohibits writing imports that go beyond the directories specified by you.

## Installation
```
yarn add -D eslint-plugin-no-imports

or

npm install -D eslint-plugin-no-imports
```

## Description

Below is a file structure where `packages/brand` and `packages/analytics` are independent modules from the project.

They can only import files that are within the same directories. Going beyond the specified directories is prohibited.

For example, the `brand/index.js` file can import `brandFile.js` but cannot import `srcFile.js` or `analytics/*.js` files, because it is outside the `brand` directory.

```
└── src/
    ├── srcFile.js
    └── packages/
        ├── brand/
        │   ├── index.js
        │   └── brandFile.js
        └── analytics/
            └── ...
```

## How to use:
Add to your `.eslintrc`:
```
"plugins": ["no-imports"],
"rules": {
    "no-imports/outside-special-folder": [
      'error',
      {
        directories: ['./src/packages/brand', './src/packages/analytics'],
        aliases: [{ alias: 'app', pathToFolder: './src' }, { alias: '@', pathToFolder: './modules' }],
        ignore: ['./bin/**/*'],
      },
    ],
}
```

## Examples:

```
/brand/index.js

✅ Good - These files are located in the `brand` directory. Everything is fine here. 
import data from './brandData';
import utils from 'alias/packages/brand/utils';

❌ Error - These files are outside the `brand` directory, so we will get an error.  
import constants from '../packagesConstants';
import utils from '../../srcUtils';
import data from '@/data';
```


If you add an ignore section as shown in (How to use), eslint will not complain about these directories/files.

```
/brand/index.js

✅ Good - The `bin` directory is located in the ignore section. Everything is fine here. 
import binConstaints from '../../../bin/constaints';
```

## Windows

When specifying a folder path in the sections: directories, ignore, aliases - using escape characters is prohibited. Otherwise, it will break the logic for Windows users.

## Options

| Name        | Required        | Description                                                                                                     |
|-------------|-----------------|-----------------------------------------------------------------------------------------------------------------|
| directories | +               | List of directories we are monitoring. If an import goes beyond the established directory, we receive an error. |
| ignore      | -               | List of directories that are exceptions.                                                                        |
| aliases     | -               | If you have imports specified via aliases, you need to specify them here as well.                               |
