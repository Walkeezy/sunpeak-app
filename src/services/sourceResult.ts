export type SourceResult<T> = {
  data: T;
  ok: boolean;
};

export async function settle<T>(promise: Promise<T>, fallback: T): Promise<SourceResult<T>> {
  try {
    return { data: await promise, ok: true };
  } catch (err) {
    console.error(err);

    return { data: fallback, ok: false };
  }
}
