// 10Kb = 1024 * 10
export const DEFAULT_CHUNK_SIZE = 1024 * 10;

export function stringToChunks(
  data: string,
  chunkSize: number = DEFAULT_CHUNK_SIZE
): string[] {
  const chunks: string[] = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  return chunks;
}
