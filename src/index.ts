import noLiteral from "./rules/no-literal";
import isPrefixForBoolean from "./rules/is-prefix-for-boolean";

export = {
  rules: {
    "no-literal": noLiteral,
    "is-prefix-for-boolean": isPrefixForBoolean,
  },
};