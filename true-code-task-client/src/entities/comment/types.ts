export type Comment = { id?: number; message: string; fileIds: string[]; publish_at: string };
export type CommentsRes = { items: Comment[]; total: number };
