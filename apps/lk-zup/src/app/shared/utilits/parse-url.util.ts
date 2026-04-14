export function parseUrl(url: string): ParseUrlResult {
  const [path, params] = url.split('?', 2);
  const parsedParams = params?.split('&').reduce((acc, param) => {
    const [key, value] = param.split('=', 2);
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});
  const pathFragments = ['', ...path.split('/').filter((v) => !!v)];
  const isEmpty = pathFragments.length === 1;

  return {
    path: pathFragments,
    params: parsedParams,
    isEmpty,
  };
}

export interface ParseUrlResult {
  path: string[];
  params: Record<string, string>;
  isEmpty: boolean;
}
