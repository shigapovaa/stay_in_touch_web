import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  notification, Card, Button, Modal, Input, Select,
} from 'antd';
import { fetchFeed, createPost } from '../../../api/news';
import NewsCard from '../components/NewsCard';
import DetailsModal from '../components/DetailsModal';

export default class News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      isLoading: true,
      chosenNewsId: null,
      newPostData: null,
    };
  }

  componentDidMount() {
    fetchFeed().then((result) => {
      this.setState({
        news: result.data,
      });
    }).catch(() => {
      notification.error({ message: 'Error!', description: 'Error occurred while loading news', placement: 'bottomRight' });
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  showDetails = (chosenNewsId) => {
    this.setState({
      chosenNewsId,
    });
  }

  closeDetails = () => {
    this.setState({
      chosenNewsId: null,
    });
  }

  startCreatingPost = () => {
    this.setState({
      newPostData: {
        text: '',
        add_tags: '',
      },
    });
  };

  cancelCreatingPost = () => {
    this.setState({
      newPostData: null,
    });
  }

  onCreatePost = () => {
    const { newPostData, news } = this.state;
    const add_tags = newPostData.add_tags.split(' ');
    add_tags.forEach((item, idx) => {
      if (item.slice(0, 1) !== '#') {
        add_tags[idx] = `#${item}`;
      }
    });

    createPost(
      { ...newPostData, add_tags },
    ).then((result) => {
      const updatedNews = [...news];
      updatedNews.unshift(result.data);
      this.setState({
        news: updatedNews,
        newPostData: null,
      }, () => {
        this.forceUpdate();
      });
    }).catch(() => {
      notification.error({
        message: 'Error!',
        description: 'Error occurred while creating new post',
        placement: 'bottomRight',
      });
    });
  }

  render() {
    const {
      news, isLoading, chosenNewsId, newPostData,
    } = this.state;

    return (
      <>
        <Redirect to="/site/news" />
        <Button
          type="primary"
          size="default"
          style={{ marginBottom: '12px' }}
          onClick={() => this.startCreatingPost()}
        >
          Create new post
        </Button>
        {isLoading && (
        <Card loading={isLoading} />
        )}
        {!isLoading && news.length > 0 && news.map((item) => <NewsCard item={item} key={item.id} showDetails={this.showDetails} />)}
        {!isLoading && news.length < 1 && <h2>No news yet</h2>}
        <DetailsModal id={chosenNewsId} closeDetails={this.closeDetails} />

        <Modal
          title="New post"
          visible={!!newPostData}
          okText="Create"
          onOk={this.onCreatePost}
          onCancel={this.cancelCreatingPost}
        >
          <Input.TextArea
            placeholder="Post text"
            onChange={
              (event) => {
                this.setState({
                  newPostData: {
                    ...newPostData,
                    text: event.target.value,
                  },
                });
              }
            }
            rows={6}
            value={newPostData && newPostData.text}
            style={{ marginBottom: '12px', resize: 'none' }}
          />
          <Input
            placeholder="Tags, splitted by whitespace"
            value={newPostData && newPostData.add_tags}
            onChange={
              (event) => {
                this.setState({
                  newPostData: {
                    ...newPostData,
                    add_tags: event.target.value,
                  },
                });
              }
            }
            style={{ marginBottom: '12px' }}
          />
          <Select style={{ marginBottom: '12px' }} defaultValue="image">
            <Select.Option value="image">Image</Select.Option>
            <Select.Option value="link">Link</Select.Option>
            <Select.Option value="video">Video</Select.Option>
            <Select.Option value="file">File</Select.Option>
          </Select>
          <br />
          <input type="file" title="Upload" onChange={(event) => console.log(event.target.files[0])} />
        </Modal>
      </>
    );
  }
}
