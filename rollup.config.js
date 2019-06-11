import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'printArea.js',
  output: [
    {
      file: 'dist/index.js',
      name: 'index.js',
      format: 'umd',
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};
