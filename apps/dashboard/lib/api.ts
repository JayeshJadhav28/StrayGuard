function normalizeApiBase(base?: string) {
  const fallback = 'http://localhost:3000/api/v1';
  const raw = (base || fallback).replace(/\/$/, '');
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
}

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

export async function fetchAPI(endpoint: string, options?: RequestInit) {
	let accessToken: string | undefined;

	if (typeof window !== 'undefined') {
		const { getSession } = await import('next-auth/react');
		const session = await getSession();
		accessToken = session?.accessToken;
	}

	const res = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...options?.headers,
		},
	});

	if (!res.ok) {
		throw new Error(`API error: ${res.statusText}`);
	}

	return res.json();
}
