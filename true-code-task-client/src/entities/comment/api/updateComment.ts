import { fetchWithToken } from '../../../shared';
import { Comment } from '../types';

export async function updateComment(comment: Comment) {
  await fetchWithToken(`/api/comments/${comment.id}`, {
    method: 'PUT',
    body: JSON.stringify(comment),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
