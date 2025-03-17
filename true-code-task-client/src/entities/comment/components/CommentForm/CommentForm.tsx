import { Button, Card, Col, Form, Image, Input, Row, Upload } from 'antd';
import { Comment } from '../../types';

import { PlusOutlined } from '@ant-design/icons';

import { useCommentForm } from './useCommentForm';

type ProfileFormProps = { comment?: Comment; onStopEdit: () => void };
export const CommentForm = (props: ProfileFormProps) => {
  const { message, form, onFinish, onDelete, onUpload, newFileIds, onStopEdit } = useCommentForm(props);

  return (
    <Card
      role="form"
      aria-labelledby="comment-form"
      extra={
        <Button type="link" onClick={onStopEdit} aria-label="Закрыть форму редактирования">
          Отмена
        </Button>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Ваш комментарий"
          name="message"
          initialValue={message}
          rules={[{ required: true, message: 'Введите комментарий' }]}
        >
          <Input.TextArea placeholder="Введите комментарий..." aria-describedby="comment-error" />
        </Form.Item>

        <section aria-labelledby="images-section">
          <Row gutter={16}>
            {newFileIds.map((fileId) => (
              <Col span={3} key={fileId}>
                <Image alt={`Изображение`} src={`/api/files/${fileId}`} />
                <Button
                  aria-label="Удалить изображение"
                  type="text"
                  danger
                  style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '12px' }}
                  onClick={onDelete(fileId)}
                >
                  ✖
                </Button>
              </Col>
            ))}
            <Col>
              <Upload.Dragger
                action={'/api/files/upload'}
                showUploadList={false}
                onChange={onUpload}
                style={{ width: '150px', height: '150px' }}
                aria-describedby="upload-instructions"
              >
                <div>
                  <PlusOutlined />
                  <div>Загрузить</div>
                </div>
              </Upload.Dragger>
            </Col>
          </Row>
        </section>

        <Button type="primary" htmlType="submit" aria-label="Отправить комментарий" style={{ marginTop: '15px' }}>
          Отправить
        </Button>
      </Form>
    </Card>
  );
};
