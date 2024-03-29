export const GET = <T>(url: string): Promise<T> =>
  fetch(url, { method: "GET" }).then<T>(res => res.json());
