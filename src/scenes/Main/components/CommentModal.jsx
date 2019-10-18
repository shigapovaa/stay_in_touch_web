import React from 'react';
import { Modal, notification, Input } from 'antd';
import { replyToComment } from '../../../api/comments';

export default class CommentModal extends React.Component {
  constructor(props) {
    super(props);

    this.commentRef = React.createRef();
  }

  onPostClick = () => {
    const { commentId, onSave } = this.props;
    replyToComment(commentId, this.commentRef.current.state.value).then((res) => {
      console.log(res);
      onSave();
    }).catch(() => {
      notification.error({
        message: 'Error!',
        description: 'Error occurred while replying to comment',
        placement: 'bottomRight',
      });
    });
  }

  render() {
    const { commentId, onCancel } = this.props;

    return (
      <Modal
        title="New comment"
        visible={!!commentId}
        okText="Post"
        onOk={this.onPostClick}
        onCancel={onCancel}
      >
        <Input type="text" ref={this.commentRef} />
      </Modal>
    );
  }
}
