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
          "enum": ["error"]
        },
        {
          "type": "object",
          "properties": {
            "directories": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "ignore": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "additionalProperties": false
        }
      ],
    },
  ],
};
