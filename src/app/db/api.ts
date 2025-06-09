
export async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${process.env.KILO_API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}