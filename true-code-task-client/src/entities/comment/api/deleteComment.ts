import { fetchWithToken } from '../../../shared';

export async function deleteComment(commentId: number) {
  await fetchWithToken(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
}
