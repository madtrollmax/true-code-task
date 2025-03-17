export async function fetchWithToken(
  input: RequestInfo | URL,
  init?: RequestInit & { signal?: AbortSignal },
): Promise<Response> {
  let token = localStorage.getItem('token');

  if (!token) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return Promise.reject({ status: 401, statusText: 'Unauthorized' });
    token = refreshed;
  }

  const headers = { ...init?.headers, Authorization: `Bearer ${token}` };

  try {
    const response = await fetch(input, { ...init, headers });

    // Если access-токен истек, пробуем обновить и повторяем запрос
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) return Promise.reject({ status: 401, statusText: 'Unauthorized' });

      return fetch(input, {
        ...init,
        headers: { ...headers, Authorization: `Bearer ${refreshed}` },
      });
    }

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
      return null;
    }

    const data = await response.json();
    localStorage.setItem('token', data.accessToken);
    window.dispatchEvent(new Event('storage'));
    return data.accessToken;
  } catch {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    return null;
  }
}
