import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsparser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // JavaScript 和 JSX 文件
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["eslint.config.js"], // ESLint 配置文件
    languageOptions: {
      globals: globals.node,
    },
  },
  // 针对 TypeScript 文件的规则
  {
    files: ["**/*.{ts,tsx}"], // TypeScript 和 TSX 文件
    languageOptions: {
      parser: tsparser, // 使用 TypeScript parser
      parserOptions: {
        project: "./tsconfig.json", // 指定 tsconfig.json 文件路径
        tsconfigRootDir: process.cwd(),
      },
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error", // 检查未使用的变量
      "@typescript-eslint/explicit-function-return-type": "warn", // 强制函数返回类型显式声明
      "@typescript-eslint/no-explicit-any": "warn", // 避免使用 any 类型
      "@typescript-eslint/no-floating-promises": "error", // 确保所有 Promise 被处理
      "@typescript-eslint/no-non-null-assertion": "warn", // 避免使用非空断言 `!`
    },
  },
  {
    files: ["vite.config.ts"], // Vite 配置文件
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.node.json", // 指定 tsconfig.json 文件路径
      },
      globals: globals.node,
    },
  },
  { ignores: ["node_modules", "dist"] },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];
