module.exports = {
  type: 'problem',
    docs: {
    description: 'Disallow imports that are outside of a specific directory',
      category: 'Possible Errors',
      recommended: true,
  },
  schema: [
    {
      "type": "array",
      "items": [
        {
          "type": "string",
          "enum": ["error"],
        },
        {
          "type": "object",
          "properties": {
            "directories": {
              "type": "array",
              "items": {
                "type": "string",
              },
              "minItems": 1,
            },
            "aliases": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "alias": {
                    "type": "string",
                  },
                  "pathToFolder": {
                    "type": "string",
                  },
                },
                "required": ["alias", "pathToFolder"],
              },
            },
            "ignore": {
              "type": "array",
              "items": {
                "type": "string",
              },
              "minItems": 1,
            },
          },
          "additionalProperties": false
        },
      ],
    },
  ],
};
