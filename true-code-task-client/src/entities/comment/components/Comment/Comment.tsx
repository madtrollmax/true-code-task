import { useState } from 'react';

import { Button } from 'antd';

import { CommentView } from '../CommentView';
import { Comment as CommentType } from '../../types';
import { CommentForm } from '../CommentForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../api';

export const Comment = (props: { comment: CommentType }) => {
  const { comment } = props;
  const [isEdit, setIsEdit] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteComment,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'list'] });
    },
  });

  const onDelete = () => {
    //TODO запрос подтверждения удаления
    if (comment.id) {
      mutation.mutate(comment.id);
    }
  };

  return (
    <>
      {!isEdit && (
        <div>
          <span>Опубликовано: {comment.publish_at}</span>
          <Button onClick={() => setIsEdit(true)} type="link">
            Редактировать
          </Button>
          <Button onClick={onDelete} type="link">
            Удалить
          </Button>
        </div>
      )}

      {!isEdit ? (
        <CommentView comment={comment} />
      ) : (
        <CommentForm comment={comment} onStopEdit={() => setIsEdit(false)} />
      )}
    </>
  );
};
