import React from 'react';
import {
  Row, Col, Card, Button, Icon, Tag, Avatar, Badge,
} from 'antd';

const parseTime = (date) => {
  const parsed = new Date(date);
  return `${parsed.toDateString()}, ${parsed.getHours()}:${parsed.getMinutes() < 10 ? `0${parsed.getMinutes()}` : parsed.getMinutes()}`;
};

const NewsCard = ({ item, showDetails }) => {
  const displayDate = parseTime(item.created);

  return (
    <Card
      key={item.id}
      title={(
        <Card.Meta
          avatar={<Avatar size="large" style={{ marginTop: '8px' }} src={item.author.profile.photo_url} />}
          title={(
            <>
              {item.author.first_name}
              {' '}
              {item.author.last_name}
              {' '}
              <span style={{ fontStyle: 'italic', color: '#d3d3d3', fontSize: '14px' }}>
                @
                {item.author.username}
              </span>
            </>
          )}
          description={<span style={{ fontSize: '14px' }}>{displayDate}</span>}
        />
      )}
      style={{ marginBottom: '12px' }}
      extra={(
        <Button
          type="primary"
          size="small"
          title="View details"
          style={{ lineHeight: 1 }}
          onClick={() => showDetails(item.id)}
        >
          <Icon type="eye" />
                  View
        </Button>
      )}
    >
      <Row style={{ marginBottom: '12px' }}>
        <Col>{item.text}</Col>
      </Row>
      <Row style={{ marginBottom: '12px' }}>
        {item.attachments.map((attachment) => {
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
      <Row>
        <Col>
          {item.tags.map((tag) => (
            <Tag key={tag.id} color="#1890ff" style={{ cursor: 'pointer' }}>
              {tag.name}
            </Tag>
          ))}
        </Col>
      </Row>
    </Card>
  );
};

export default NewsCard;
