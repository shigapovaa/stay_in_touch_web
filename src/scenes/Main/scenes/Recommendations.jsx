import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  notification, Card, Input,
} from 'antd';
import { fetchNews, findNews } from '../../../api/news';
import NewsCard from '../components/NewsCard';
import DetailsModal from '../components/DetailsModal';

export default class Recommendations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      isLoading: true,
      chosenNewsId: null,
    };
  }

  componentDidMount() {
    fetchNews().then((result) => {
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


  onSearch = (value) => {
    this.setState({
      isLoading: true,
    });

    if (value === '') {
      fetchNews().then((result) => {
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
    } else {
      findNews(value).then((result) => {
        this.setState({
          news: result.data,
        });
      }).catch(() => {
        notification.error({
          message: 'Error!',
          description: 'Error occurred while searching',
          placement: 'bottomRight',
        });
      }).finally(() => {
        this.setState({
          isLoading: false,
        });
      });
    }
  }

  render() {
    const {
      news, isLoading, chosenNewsId,
    } = this.state;

    return (
      <>
        <Redirect to="/site/recommendations" />
        <Input.Search
          placeholder="Search by tags, splitted by whitespace"
          enterButton
          onSearch={this.onSearch}
          style={{ marginBottom: '12px' }}
        />
        {isLoading && (
          <Card loading={isLoading} />
        )}
        {!isLoading && news.length > 0 && news.map((item) => <NewsCard item={item} key={item.id} showDetails={this.showDetails} />)}
        {!isLoading && news.length < 1 && <h2>No news yet</h2>}
        <DetailsModal id={chosenNewsId} closeDetails={this.closeDetails} />
      </>
    );
  }
}
