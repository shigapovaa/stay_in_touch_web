import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Row, Col, Radio, Comment, Avatar, Spin, notification,
} from 'antd';
import { fetchAnswers, fetchMyComments } from '../../../api/comments';

const parseTime = (date) => {
  const parsed = new Date(date);
  return `${parsed.toDateString()}, ${parsed.getHours()}:${parsed.getMinutes() < 10 ? `0${parsed.getMinutes()}` : parsed.getMinutes()}`;
};

const UserComment = ({ comment, onReplyClick, children }) => (
  <Comment
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
  />
);

export default class Answers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'answers',
      items: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.loadAnswers();
  }

  loadAnswers = () => {
    this.setState({
      isLoading: true,
      items: [],
    }, () => {
      fetchAnswers().then((result) => {
        this.setState({
          items: result.data,
        });
      }).catch(() => {
        notification.error({
          message: 'Error!',
          description: 'Error occurred while loading comments',
          placement: 'bottomRight',
        });
      }).finally(() => {
        this.setState({
          isLoading: false,
        });
      });
    });
  }

  loadComments = () => {
    this.setState({
      isLoading: true,
      items: [],
    }, () => {
      fetchMyComments().then((result) => {
        this.setState({
          items: result.data,
        });
      }).catch(() => {
        notification.error({
          message: 'Error!',
          description: 'Error occurred while loading comments',
          placement: 'bottomRight',
        });
      }).finally(() => {
        this.setState({
          isLoading: false,
        });
      });
    });
  }

  switchTab = (event) => {
    this.setState({
      tab: event.target.value,
    }, () => {
      if (event.target.value === 'answers') {
        this.loadAnswers();
      } else {
        this.loadComments();
      }
    });
  };

  render() {
    const { tab, items, isLoading } = this.state;
    return (
      <>
        <Redirect to="/site/answers" />
        <Row style={{ marginBottom: '12px' }}>
          <Col>
            <Radio.Group value={tab} onChange={this.switchTab}>
              <Radio.Button value="answers">Answers</Radio.Button>
              <Radio.Button value="comments">My Comments</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        {isLoading && (
          <Row>
            <Col>
              <Spin size="large" />
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            {items.map((item) => (
              <UserComment comment={item} key={item.id} />
            ))}
          </Col>
        </Row>
      </>
    );
  }
}
