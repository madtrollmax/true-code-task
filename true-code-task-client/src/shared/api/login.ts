export async function login(uid: string, password: string) {
  const { accessToken } = await (
    await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ uid, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

  localStorage.setItem('token', accessToken);
  window.dispatchEvent(new Event('storage'));
}
