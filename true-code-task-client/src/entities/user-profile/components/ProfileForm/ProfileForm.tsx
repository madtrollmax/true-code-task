import { Form, Button, Input, Upload, Card, Avatar } from 'antd';
import { UserProfile } from '../../types';
import { FC } from 'react';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useProfileForm } from './useProfileForm';

type ProfileFormProps = { profile: UserProfile; onStopEdit: () => void };

export const ProfileForm: FC<ProfileFormProps> = (props) => {
  const { onStopEdit, onUpload, onFinish, onReset, info, firstname, lastname, email, phone, fId, form } =
    useProfileForm(props);

  return (
    <Card
      role="form"
      aria-labelledby="profile-form"
      extra={
        <Button type="link" onClick={onStopEdit} aria-label="Закрыть форму редактирования">
          Закрыть
        </Button>
      }
    >
      <Upload.Dragger
        action={'/api/files/upload'}
        showUploadList={false}
        onChange={onUpload}
        style={{ width: '150px', height: '150px' }}
        aria-describedby="upload-instructions"
      >
        <Avatar size={100} src={`/api/files/${fId}`} icon={!fId && <UserOutlined />} alt="Фотография профиля" />
      </Upload.Dragger>

      <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
        <Form.Item
          name="firstname"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя' }]}
          initialValue={firstname}
        >
          <Input placeholder="Имя" />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Фамилия"
          rules={[{ required: true, message: 'Введите фамилию' }]}
          initialValue={lastname}
        >
          <Input placeholder="Фамилия" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', required: true, message: 'Введите email' }]}
          initialValue={email}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Телефон"
          rules={[{ required: true, message: 'Введите телефон' }]}
          initialValue={phone}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Телефон" />
        </Form.Item>
        <Form.Item name="info" label="О себе" initialValue={info}>
          <Input.TextArea placeholder="Напишите краткую информацию о себе" />
        </Form.Item>
        <Button type="primary" htmlType="submit" aria-label="Сохранить изменения">
          Сохранить изменения
        </Button>
        <Button htmlType="button" onClick={onReset} aria-label="Вернуть по умолчанию">
          Вернуть по умолчанию
        </Button>
      </Form>
    </Card>
  );
};
