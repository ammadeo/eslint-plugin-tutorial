import { RuleTester } from "eslint";

import rule from "./is-prefix-for-boolean";

const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: { ecmaVersion: 2015 }
});

tester.run("is-prefix-for-boolean", rule, {
  valid: [
    { code: `const isVisible = ref(true)` },
    { code: `const isVisible = ref(false)` },
    { code: `const isVisible = ref<boolean | undefined>()` }],
  invalid: [
    {
      code: `const visible = ref(true)`,
      errors: [{ message: "Prefix boolean variables with 'is' e.g. isVisible" }],
    },
    {
      code: `const visible = ref(false)`,
      errors: [{ message: "Prefix boolean variables with 'is' e.g. isVisible" }],
    },
    {
      code: `const visible = ref<boolean | undefined>()`,
      errors: [{ message: "Prefix boolean variables with 'is' e.g. isVisible" }],
    },
  ],
});
