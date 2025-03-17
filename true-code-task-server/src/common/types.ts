export type WithId<T, TId extends any = number> = T & { id: TId };
export type Pageable<T> = {
  items: T[];
  total: number;
  page?: number;
  itemsOnPage?: number;
};
