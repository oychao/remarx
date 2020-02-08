export function startWithCapitalLetter(str: string): boolean {
  const charCode = str.charCodeAt(0);
  return charCode > 64 && charCode < 91;
}
