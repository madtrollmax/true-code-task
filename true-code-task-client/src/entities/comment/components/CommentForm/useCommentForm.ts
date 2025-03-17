import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment } from '../../types';
import { createComment, updateComment } from '../../api';
import { useState } from 'react';
import { UploadChangeParam } from 'antd/es/upload';
import { Form } from 'antd';

export const useCommentForm = (props: { comment?: Comment; onStopEdit: () => void }) => {
  const { comment, onStopEdit } = props;
  const { fileIds = [], message = '' } = comment ?? {};
  const [form] = Form.useForm();
  const [newFileIds, setFileIds] = useState(fileIds);

  const onUpload = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      setFileIds([...newFileIds, info.file.response.fileId]);
    }
  };

  const onDelete = (fileId: string) => () => {
    setFileIds(newFileIds.filter((fId) => fId !== fileId));
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: comment ? updateComment : createComment,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'list'] });
    },
  });

  const onFinish = (values: Comment) => {
    mutation.mutate(
      { ...comment, ...values, fileIds: [...newFileIds] },
      {
        onSuccess: () => {
          onStopEdit();
          //TODO прописать уведолмлялку
        },
        onError: () => {
          //TODO прописать уведолмлялку
        },
      },
    );
  };

  return {
    message,
    form,
    newFileIds,
    onFinish,
    onDelete,
    onUpload,
    onStopEdit,
  };
};
