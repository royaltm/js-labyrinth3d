import buble from 'rollup-plugin-buble';

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  sourcemap: false,
  plugins: [
      buble({transforms: {
        // arrow:                         true,
        // classes:                       true,
        // collections:                   true,
        // computedProperty:              true,
        // conciseMethodProperty:         true,
        // constLoop:                     true,
        // dangerousForOf:                false,
        // dangerousTaggedTemplateString: false,
        // defaultParameter:              true,
        // destructuring:                 true,
        // forOf:                         false,
        generator:                     false,
        // letConst:                      true,
        // modules:                       false,
        // numericLiteral:                true,
        // parameterDestructuring:        true,
        // reservedProperties:            true,
        // spreadRest:                    true,
        // stickyRegExp:                  true,
        // templateString:                true,
        // unicodeRegExp:                 true,
      }})
  ],
}
