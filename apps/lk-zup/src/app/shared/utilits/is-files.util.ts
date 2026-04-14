export function isFiles(props: any): boolean {
  let prop = props;
  if (Array.isArray(prop)) {
    prop = prop[0];
  }
  return !!prop?.file64 && !!prop?.fileName;
}
