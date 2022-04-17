declare module 'rollup-plugin-serve' {
  import type { Plugin } from 'rollup';
  type ServeOptions = {
    contentBase: string | string[];
    historyApiFallback: boolean | string;
    host: string;
    open: boolean;
    openPage: string;
    port: number;
    verbose: boolean;
  };
  const serve: (options: Partial<ServeOptions>) => Plugin;
  export default serve;
}

declare module '*.scss' {
  const styles: unknown;
  export default styles;
}
