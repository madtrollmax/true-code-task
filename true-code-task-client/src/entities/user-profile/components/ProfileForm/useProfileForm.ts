import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '../../types';
import { useState } from 'react';
import { UploadChangeParam } from 'antd/es/upload';
import { updateProfile } from '../../api';
import { Form } from 'antd';

export const useProfileForm = (props: { profile: UserProfile; onStopEdit: () => void }) => {
  const { profile, onStopEdit } = props;
  const { fileId, info, firstname, lastname, email, phone } = profile;
  const [form] = Form.useForm();
  const [newFileId, setNewFileId] = useState<string | undefined>();
  const fId = newFileId ?? fileId;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const onReset = () => {
    form.resetFields();
    setNewFileId(undefined);
  };

  const onUpload = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      //TODO прописать удаление при повторной загрузке
      setNewFileId(info.file.response.fileId);
    }
  };

  const onFinish = (values: Omit<UserProfile, 'login'>) => {
    mutation.mutate(
      { ...profile, ...values, fileId: fId },
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
    info,
    firstname,
    lastname,
    email,
    phone,
    fId,
    form,
    onStopEdit,
    onReset,
    onUpload,
    onFinish,
  };
};
