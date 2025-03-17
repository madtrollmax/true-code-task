import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '../../api';
import { CommentsRes } from '../../types';
import { Button, Select } from 'antd';
import { useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Comment } from '../Comment';
import { CommentForm } from '../CommentForm';

export const CommentsList = () => {
  const itemsPerPage = 3;
  const [sortField, setSortField] = useState('publish_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isNewCreate, setIsNewCreate] = useState(false);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['comments', 'list', sortField, sortOrder],
    initialPageParam: 0,
    getNextPageParam: (lastPage: CommentsRes, _p, lastPageParam) =>
      lastPage.total > (lastPageParam + 1) * itemsPerPage ? lastPageParam + 1 : undefined,
    queryFn: (page) => getComments(page.pageParam, itemsPerPage, sortField, sortOrder),
  });

  return (
    <section
      aria-labelledby="list-title"
      style={{
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <label htmlFor="sort-field">Сортировать по:</label>
        <Select
          id="sort-field"
          aria-label="Выбор поля сортировки"
          value={sortField}
          onChange={(value) => setSortField(value)}
          options={[{ label: 'Дата публикации', value: 'publish_at' }]}
        />

        <Button
          aria-label={`Сортировка: ${sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию'}`}
          onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          {sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </Button>
        <Button aria-label="Добавить комментарий" onClick={() => setIsNewCreate(!isNewCreate)}>
          Добавить комментарий
        </Button>
      </div>
      {isNewCreate && <CommentForm onStopEdit={() => setIsNewCreate(false)} />}
      <div
        role="region"
        aria-label="Список элементов"
        style={{
          overflow: 'auto',
          border: '1px solid #ddd',
          padding: '10px',
          borderRadius: '5px',
          flexGrow: 1,
        }}
      >
        {((data?.pages as CommentsRes[]) ?? [])
          .flatMap((el) => el.items)
          .map((el) => (
            <Comment comment={el} />
          ))}
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage}
          style={{ marginTop: '10px' }}
          aria-label="Загрузить еще элементы"
        >
          Загрузить еще
        </Button>
      </div>
    </section>
  );
};
