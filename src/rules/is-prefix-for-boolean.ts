import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  create: context => {
    return {
      "VariableDeclaration": node => {
        const outcome = node.declarations.some((declaration) => {
          //@ts-expect-error
          const name = declaration.id.name as string
          if (name.startsWith("is")) return true
          const init = declaration.init
          
          // check for refs and computed
          if (init?.type === 'CallExpression')
          {
            // @ts-expect-error
            if (init.callee.name === 'ref')
            {
              if (init.arguments.some(
                //@ts-expect-error
                (arg: { raw: string }) => arg.raw === "false" || arg.raw === "true")) return false
              
                //@ts-expect-error
              const typeParams: { type: string, types: {type: string}[]}[] = init.typeParameters.params;
              
              if (typeParams.some(({type}) => type === "TSBooleanKeyword")) return false
              
              if (typeParams.some(({ type }) => type === "TSUnionType") &&
                typeParams.some(({ types }) =>
                  types.some((type: { type: string }) => type.type === 'TSBooleanKeyword'))) return false
            }
          }
          // // check for not reactive variable
          else {

          }

          return true;
        })
        if (!outcome) {
          context.report({
            message: "Prefix boolean variables with 'is' ex. isVisible",
            node,
          });
        }
      },
    };
  },
};

export = rule;