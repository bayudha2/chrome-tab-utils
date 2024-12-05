export {};

declare global {
  interface Window {
    find: (
      term: string,
      caseSensitive?: boolean,
      backwards?: boolean,
      wrap?: boolean,
    ) => boolean;
  }
}
