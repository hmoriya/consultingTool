import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "prisma/**/generated/**",
      "*.js",
      "tailwind.config.js",
    ],
  },
  {
    rules: {
      // Allow unused variables that start with underscore and improve unused vars handling
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_|^[A-Z][a-zA-Z]*Schema$|^[a-z][a-zA-Z]*Schema$",
          "caughtErrorsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      // Relax some rules for development files
      "jsx-a11y/alt-text": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // Allow console statements in development
      "no-console": "off"
    }
  }
];

export default eslintConfig;
