import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  create: context => {
    return {
      // Find variable declaration e.g. const test = 3
      "VariableDeclaration": node => {
        const isValid = node.declarations.some((declaration) => {
          // @ts-expect-error types from @typescript-eslint/parser aren't defined on Rule.RuleModule
          const name = declaration.id.name as string
          if (name.startsWith("is")) return true
          const init = declaration.init
          
          // check for refs
          if (init?.type === 'CallExpression')
          {
            // @ts-expect-error types from @typescript-eslint/parser aren't defined on Rule.RuleModule
            if (init.callee.name === 'ref') 
            {
              // check if argument of ref is false or true e.g. const test = ref(true)
              if (init.arguments.some(
                // @ts-expect-error types from @typescript-eslint/parser aren't defined on Rule.RuleModule
                (arg: { raw: string }) => arg.raw === "false" || arg.raw === "true")) return false
              
                // @ts-expect-error types from @typescript-eslint/parser aren't defined on Rule.RuleModule
              const typeParams: { type: string, types: {type: string}[]}[] = init.typeParameters.params;
              
              // check if generic type of ref is set to boolean e.g. const test = ref<boolean>()
              if (typeParams.some(({type}) => type === "TSBooleanKeyword")) return false
              
              // check if generic type of ref is set to union type with boolean e.g. const test = ref<boolean | undefined>()
              if (typeParams.some(({ type }) => type === "TSUnionType") &&
                typeParams.some(({ types }) =>
                  types.some((type: { type: string }) => type.type === 'TSBooleanKeyword'))) return false
            }
          }
          // TODO check for not reactive variable
          else {

          }

          return true;
        })
        // Display an error message
        if (!isValid) {
          context.report({
            message: "Prefix boolean variables with 'is' e.g. isVisible",
            node,
          });
        }
      },
    };
  },
};

export = rule;