import { FC } from 'react';
import { Comment } from '../../types';
import { Card, Col, Row, Alert, Image } from 'antd';

type CommentViewProps = {
  comment: Comment;
};
export const CommentView: FC<CommentViewProps> = (props) => {
  const { comment } = props;
  return (
    <section style={{ padding: '20px' }} aria-labelledby={`message`}>
      <section aria-labelledby="message-section" style={{ marginBottom: '20px' }}>
        <Alert
          message={comment.message}
          type="info"
          showIcon
          role="alert"
          aria-live="assertive"
          aria-labelledby="message-alert"
        />
      </section>
      {!!comment.fileIds.length && (
        <section aria-labelledby="images-section">
          <Row gutter={16}>
            {comment.fileIds.map((fileId) => (
              <Col span={8} key={fileId}>
                <Card
                  hoverable
                  cover={<Image alt={`Изображение`} src={`/api/files/${fileId}`} />}
                  aria-labelledby={`image-${fileId}`}
                />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </section>
  );
};
