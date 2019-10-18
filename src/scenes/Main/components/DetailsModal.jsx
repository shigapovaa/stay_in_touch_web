import React from 'react';
import {
  Modal, Spin, Card, notification, Avatar, Row, Col, Tag, Icon, Tooltip, Comment, Button, Input,
} from 'antd';
import { observer } from 'mobx-react';
import { fetchNewsDetails } from '../../../api/news';
import tagsStore from '../../../store/tagsStore';
import authStore from '../../../store/authStore';
import { subscribeToTag, unsubscribeFromTag } from '../../../api/tags';
import CommentModal from './CommentModal';
import { commentPost } from '../../../api/comments';

const parseTime = (date) => {
  const parsed = new Date(date);
  return `${parsed.toDateString()}, ${parsed.getHours()}:${parsed.getMinutes() < 10 ? `0${parsed.getMinutes()}` : parsed.getMinutes()}`;
};

const UserComment = ({ comment, onReplyClick, children }) => (
  <Comment
    actions={children && [<Button size="small" type="link" onClick={() => onReplyClick(comment.id)}>Reply</Button>]}
    author={(
      <span>
        {`${comment.author.first_name} ${comment.author.last_name}`}
        ,
        {' '}
        {parseTime(comment.created)}
      </span>
    )}
    avatar={<Avatar src={comment.author.profile.photo_url} />}
    content={comment.text}
  >
    {children}
  </Comment>
);

const defaultData = {
  firstName: 'Name',
  lastName: 'Surname',
  username: 'Username',
  photoUrl: '',
  text: '',
  tags: [],
  attachments: [],
  comments: [],
  created: new Date().toDateString(),
};

class DetailsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: defaultData,
      comToReplyId: null,
      newsToCom: null,
      commentContent: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props;
    if (id) {
      if (prevProps.id !== id) {
        this.loadNewsDetails(id);
      }
    }
  }

  loadNewsDetails = (id) => {
    this.setState({
      isLoading: true,
    }, () => {
      fetchNewsDetails(id)
        .then((result) => {
          console.log(result.data);
          const date = new Date(result.data.created);
          this.setState({
            data: {
              firstName: result.data.author.first_name,
              lastName: result.data.author.last_name,
              username: result.data.author.username,
              text: result.data.text,
              tags: result.data.tags,
              photoUrl: result.data.author.profile.photo_url,
              attachments: result.data.attachments,
              comments: result.data.comments,
              created: `${date.toDateString()}, ${date.getHours()}:${date.getMinutes()}`,
            },
          });
        }).catch(() => {
          notification.error({
            message: 'Error!',
            description: 'Error occurred while loading news info',
            placement: 'bottomRight',
          });
        }).finally(() => {
          this.setState({
            isLoading: false,
          });
        });
    });
  }

  subToTag = (id) => {
    subscribeToTag(id).then((result) => {
      tagsStore.addTag(result.data);
      this.forceUpdate();
    }).catch(() => {
      notification.error({
        message: 'Error!',
        description: 'Error occurred while trying to subscribe to tag',
        placement: 'bottomRight',
      });
    });
  };

  unsubFromTag = (id) => {
    unsubscribeFromTag(id).then(() => {
      tagsStore.removeTag(id);
      this.forceUpdate();
    }).catch(() => {
      notification.error({
        message: 'Error!',
        description: 'Error occurred while trying to unsubscribe to tag',
        placement: 'bottomRight',
      });
    });
  }

  onStartCom = () => {
    this.setState({
      newsToCom: this.props.id,
    });
  }

  onCancelCom = () => {
    this.setState({
      newsToCom: null,
    });
  };

  onCommentInput = ({ target: { value } }) => {
    this.setState({
      commentContent: value,
    });
  }

  onComment = () => {
    commentPost(this.props.id, this.state.commentContent).then(() => {
      this.onCancelCom();
      this.loadNewsDetails(this.props.id);
    }).catch(() => {
      notification.error({
        message: 'Error!',
        description: 'Error occurred while posting comment',
        placement: 'bottomRight',
      });
    });
  }

  onStartReply = (commentId) => {
    this.setState({
      comToReplyId: commentId,
    });
  }

  onCancelReply = () => {
    this.setState({
      comToReplyId: null,
    });
  }

  onReply = () => {
    this.onCancelReply();
    this.loadNewsDetails(this.props.id);
  }

  render() {
    const {
      isLoading, data: {
        firstName, lastName, username, photoUrl, attachments, comments, created, text, tags,
      }, comToReplyId, newsToCom,
    } = this.state;
    const { id, closeDetails } = this.props;
    const tagIds = tagsStore.tags.map((item) => item.id);
    const displayTags = tags.map((tag) => {
      const isSub = tagIds.includes(tag.id);
      return (
        <Tooltip key={tag.id} title={isSub ? 'Unsubscribe from tag' : 'Subscribe to tag'}>
          <Tag
            color={isSub ? 'green' : 'red'}
            style={{ cursor: 'pointer' }}
            onClick={isSub ? () => this.unsubFromTag(tag.id) : () => this.subToTag(tag.id)}
          >
            {tag.name}
          </Tag>
        </Tooltip>
      );
    });

    return (
      <Modal
        title="Show details"
        visible={!!id}
        onCancel={closeDetails}
        bodyStyle={{ padding: 0 }}
        footer={null}
        style={{ top: 20 }}
      >
        {isLoading && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Spin size="default" />
          </div>
        )}
        {!isLoading && (
          <>
            <Card
              bordered={false}
              bodyStyle={{ padding: '16px ' }}
              title={(
                <Card.Meta
                  avatar={<Avatar size="large" style={{ marginTop: '8px' }} src={photoUrl} />}
                  title={(
                    <>
                      {firstName}
                      {' '}
                      {lastName}
                      {' '}
                      <span style={{ fontStyle: 'italic', color: '#d3d3d3', fontSize: '14px' }}>
                      @
                        {username}
                      </span>
                    </>
                )}
                  description={<span style={{ fontSize: '14px' }}>{created}</span>}
                />
)}
            >
              <Row style={{ marginBottom: '12px' }}>
                <Col>{text}</Col>
              </Row>
              <Row style={{ marginBottom: '12px' }}>
                {attachments.map((attachment) => {
                  switch (attachment.label) {
                    case 'image':
                      return <img key={attachment.id} style={{ maxWidth: '30vw' }} src={attachment.url} alt={attachment.name} title={attachment.name} />;
                    case 'video':
                      return (
                        <video key={attachment.id} controls width={400}>
                          <source src={attachment.url} />
                        </video>
                      );
                    case 'link':
                      return (
                        <a key={attachment.id} href={attachment.url} style={{ lineHeight: 1 }} target="_blank" rel="noopener noreferrer">
                          <Icon type="link" style={{ color: '#000' }} />
                  &nbsp;
                          {attachment.url.length > 50 ? `${attachment.url.slice(0, 50)}...` : attachment.url}
                        </a>
                      );
                    default:
                      return (
                        <a key={attachment.id} href={attachment.url} style={{ lineHeight: 1 }} target="_blank" rel="noopener noreferrer">
                          <Icon type="file" style={{ color: '#000' }} />
                  &nbsp;
                          {attachment.name}
                        </a>
                      );
                  }
                })}
              </Row>
              <Row style={{ marginBottom: '12px' }}>
                <Col>
                  {displayTags}
                </Col>
              </Row>
              {!newsToCom && (
              <Row style={{ marginBottom: '12px' }}>
                <Col>
                  <Button size="small" type="primary" onClick={this.onStartCom}>Comment</Button>
                </Col>
              </Row>
              )}
              {!!newsToCom && (
                <Comment
                  avatar={<Avatar src={authStore.userData.photoUrl} />}
                  content={(
                    <>
                      <Input.TextArea rows={4} onChange={this.onCommentInput} style={{ resize: 'none', marginBottom: '8px' }} />
                      <Button type="primary" size="small" onClick={this.onComment}>Post comment</Button>
                    </>
                  )}
                />
              )}
              <Row>
                <Col>
                  {comments.map((item) => {
                    const subComments = item.answers;
                    return (
                      <UserComment comment={item} key={item.id} onReplyClick={this.onStartReply}>
                        {subComments.map((subItem) => <UserComment comment={subItem} key={subItem.id} />)}
                      </UserComment>
                    );
                  })}
                </Col>
              </Row>
            </Card>
          </>
        )}
        <CommentModal commentId={comToReplyId} onSave={this.onReply} onCancel={this.onCancelReply} />
      </Modal>
    );
  }
}

export default observer(DetailsModal);
