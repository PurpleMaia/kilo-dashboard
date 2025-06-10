
// type safe fetching from external backend api
export async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${process.env.BACKEND_API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}