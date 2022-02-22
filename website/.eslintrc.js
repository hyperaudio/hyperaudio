module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint", "prettier"],
  rules: {
    "import/extensions": [2, "ignorePackages", { ts: "never", tsx: "never" }],
    "import/no-unresolved": "error",
    "import/prefer-default-export": "off",
    "no-nested-ternary": "off",
    "prettier/prettier": [2],
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/jsx-props-no-spreading": [0],
    "react/function-component-definition": [
      2,
      {
        namedComponents: ["arrow-function", "function-declaration"],
        unnamedComponents: "arrow-function",
      },
    ],
  },
  // settings: {
  //   "import/resolver": {
  //     typescript: {
  //       alwaysTryTypes: true,
  //       project: "packages/*/tsconfig.json",
  //     },
  //   },
  // },
};
