export const cls = (...args: (string | undefined | false | null)[]): string =>
    ([] as string[]).concat(...args.map((a) => a || [])).join(' ');
