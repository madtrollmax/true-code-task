import { Button, Form, Input } from 'antd';
import { login } from '../../../shared';

type AuthData = { uid: string; password: string };

export const AuthForm = () => {
  const onFinish = (values: AuthData) => {
    login(values.uid, values.password);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="uid" label="User">
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password">
        <Input type="password" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};
