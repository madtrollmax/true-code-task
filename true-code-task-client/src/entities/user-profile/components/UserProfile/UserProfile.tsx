import { useState } from 'react';
import { getProfile } from '../../api';
import { ProfileView } from '../ProfileView';

import { Button, Skeleton } from 'antd';
import { ProfileForm } from '../ProfileForm/ProfileForm';
import { useQuery } from '@tanstack/react-query';

export const UserProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  return (
    <>
      {!isEdit && (
        <div>
          <Button onClick={() => setIsEdit(true)}> Редактировать</Button>
        </div>
      )}

      {query.data ? (
        !isEdit ? (
          <ProfileView profile={query.data} />
        ) : (
          <ProfileForm profile={query.data} onStopEdit={() => setIsEdit(false)} />
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};
