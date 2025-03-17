import { fetchWithToken } from '../../../shared';

export async function getProfile() {
  const res = await fetchWithToken('./api/profile');
  return await res.json();
}
