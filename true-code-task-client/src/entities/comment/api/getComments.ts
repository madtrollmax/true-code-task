import { fetchWithToken } from '../../../shared';
import { CommentsRes } from '../types';

export async function getComments(page = 0, size = 3, sortField?: string, sortDirection?: string) {
  const query = [
    page ? `page=${page}` : undefined,
    size ? `size=${size}` : undefined,
    sortField ? `sortField=${sortField}` : undefined,
    sortDirection ? `sortDirection=${sortDirection}` : undefined,
  ]
    .filter((el) => !!el)
    .join('&');
  const res = await fetchWithToken(`./api/comments${query ? `?${query}` : ''}`);
  return (await res.json()) as CommentsRes;
}
