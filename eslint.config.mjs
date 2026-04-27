import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Project-level rule overrides to reduce noise during deploy checks
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore tooling and temporary scripts that use CommonJS or are for local testing
    "scripts/**",
    "tmp/**",
  ]),
]);

export default eslintConfig;
