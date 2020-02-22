import typescript from 'rollup-plugin-typescript2';
// import copy from 'rollup-plugin-copy';

export default {
  input: './lib/index.ts',
  output: [
    {
      file: 'bin/index.js',
      format: 'commonjs'
    }
  ],
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: { declaration: true }
      }
    }),
    // copy({
    //   targets: [{
    //     src: 'typings/**/*.d.ts', dest: 'bin/typings'
    //   }]
    // })
  ],
  external: ['fs', 'path', 'jsonfile']
};
