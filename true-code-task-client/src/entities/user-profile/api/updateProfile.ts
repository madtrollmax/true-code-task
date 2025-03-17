import { fetchWithToken } from '../../../shared';
import { UserProfile } from '../types';

export async function updateProfile(profile: UserProfile) {
  await fetchWithToken('./api/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
