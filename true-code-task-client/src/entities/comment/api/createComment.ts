import { fetchWithToken } from '../../../shared';
import { Comment } from '../types';

export async function createComment(comment: Comment) {
  await fetchWithToken(`/api/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
