import { Avatar, Card, Typography } from 'antd';
import { UserProfile } from '../../types';
import { FC } from 'react';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

export const ProfileView: FC<{ profile: UserProfile }> = ({ profile }) => {
  const { fileId, info, firstname, lastname, email, phone } = profile;

  return (
    <section aria-labelledby="profile">
      <Card>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <figure role="img" aria-labelledby="profile-avatar" style={{ margin: 0 }}>
              <Avatar
                size={100}
                src={fileId ? `/api/files/${fileId}` : undefined}
                icon={!fileId ? <UserOutlined aria-hidden="true" /> : undefined}
                alt={`Фото профиля ${firstname} ${lastname}`}
              />
            </figure>
            <Typography.Title id="profile-title" level={4} style={{ margin: 0, textWrap: 'nowrap' }}>
              {firstname} {lastname}
            </Typography.Title>

            <ul style={{ listStyle: 'none', padding: 0, textWrap: 'nowrap' }}>
              {email && (
                <li>
                  <MailOutlined aria-hidden="true" />{' '}
                  <a href={`mailto:${email}`} aria-label={`Отправить email ${firstname} ${lastname}`}>
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <PhoneOutlined aria-hidden="true" />{' '}
                  <a href={`tel:${phone}`} aria-label={`Позвонить ${firstname} ${lastname}`}>
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
          {info && (
            <Typography.Text type="secondary" aria-label="Дополнительная информация">
              {info}
            </Typography.Text>
          )}
        </div>
      </Card>
    </section>
  );
};
