export const parseRegExp = function (regexpStr: string) {
  const from = regexpStr.indexOf('/');
  const to = regexpStr.lastIndexOf('/');
  const suffix = regexpStr.slice(to + 1);
  return new RegExp(regexpStr.slice(from + 1, to), suffix);
};
