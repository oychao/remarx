import { Compiler } from 'webpack';

// A JavaScript class.
export class RemarxWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(
      'Hello World Plugin',
      (
        stats /* stats is passed as an argument when done hook is tapped.  */
      ) => {
        console.log('Hello World!');
      }
    );
  }
}
