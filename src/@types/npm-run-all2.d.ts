module 'npm-run-all2' {
  interface RunAllOptions {
    parallel?: boolean;
    stdin?: NodeJS.ReadableStream;
    stdout?: NodeJS.WritableStream;
    stderr?: NodeJS.WritableStream;
    printLabel?: boolean;
  }

  function npmRunAll(
    patterns: string | string[],
    options?: RunAllOptions,
  ): Promise<void>;

  export default npmRunAll;
}
