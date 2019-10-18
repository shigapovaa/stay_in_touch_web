import React from 'react';
import {
  Row, Col, Avatar, notification, Spin, Input, Button, Tooltip, Tag,
} from 'antd';
import { observer } from 'mobx-react';
import { checkAuth } from '../../../api/auth';
import tagsStore from '../../../store/tagsStore';
import { subscribeToTag, unsubscribeFromTag } from '../../../api/tags';
import { updateProfile } from '../../../api/user';

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      photo_url: '',
      tags: [],
      isLoading: true,
      isUpdating: false,
    };

    this.firstNameRef = React.createRef();
    this.lastNameRef = React.createRef();
    this.emailRef = React.createRef();
  }

  componentDidMount() {
    checkAuth().then((result) => {
      this.setState({
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        username: result.data.username,
        email: result.data.email,
        photo_url: result.data.profile.photo_url,
        tags: result.data.profile.tags,
      });
    }).catch(() => {
      notification.error({
        message: 'Error!',
        description: 'Error occurred while loading profile',
        placement: 'bottomRight',
      });
    }).finally(() => {
      this.setState({
        isLoading: false,
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

  onSave = () => {
    this.setState({
      isUpdating: true,
    }, () => {
      updateProfile({
        first_name: this.firstNameRef.current.state.value,
        last_name: this.lastNameRef.current.state.value,
        email: this.emailRef.current.state.value,
      }).then(() => {
        notification.success({
          message: 'Success!',
          description: 'Successfully updated profile',
          placement: 'bottomRight',
        });
      }).catch(() => {
        notification.success({
          message: 'Success!',
          description: 'Successfully updated profile',
          placement: 'bottomRight',
        });
      }).finally(() => {
        this.setState({
          isUpdating: false,
        });
      });
    });
  }

  render() {
    const {
      first_name, last_name, username, email, photo_url, tags, isLoading, isUpdating,
    } = this.state;

    const tagIds = tagsStore.tags.map((item) => item.id);
    const displayTags = tags.map((tag) => {
      const isSub = tagIds.includes(tag.id);
      return (
        <Tooltip key={tag.id} title={isSub ? 'Unsubscribe from tag' : 'Subscribe to tag'}>
          <Tag
            color={isSub ? 'green' : 'red'}
            style={{ cursor: 'pointer', margin: '4px' }}
            onClick={isSub ? () => this.unsubFromTag(tag.id) : () => this.subToTag(tag.id)}
          >
            {tag.name}
          </Tag>
        </Tooltip>
      );
    });

    return (
      <>
        {isLoading && <div style={{ width: '100%', textAlign: 'center' }}><Spin size="large" /></div>}
        {!isLoading && (
          <>
            <Row type="flex" justify="center" align="middle" style={{ marginBottom: '12px' }}>
              <Col>
                <Avatar src={photo_url} alt={username} size="large" />
              </Col>
            </Row>
            <Row>
              <Col xs={11}>
                <Row>
                  <h3>First name</h3>
                </Row>
                <Row style={{ marginBottom: '12px' }}>
                  <Col>
                    <Input type="text" defaultValue={first_name} ref={this.firstNameRef} />
                  </Col>
                </Row>
                <Row>
                  <h3>Last name</h3>
                </Row>
                <Row style={{ marginBottom: '12px' }}>
                  <Col>
                    <Input type="text" defaultValue={last_name} ref={this.lastNameRef} />
                  </Col>
                </Row>
                <Row>
                  <h3>E-mail</h3>
                </Row>
                <Row style={{ marginBottom: '12px' }}>
                  <Col>
                    <Input type="text" defaultValue={email} ref={this.emailRef} />
                  </Col>
                </Row>
                <Row>
                  <h3>Username</h3>
                </Row>
                <Row style={{ marginBottom: '12px' }}>
                  <Col>
                    <Input type="text" defaultValue={username} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col style={{ textAlign: 'end' }}>
                    <Button type="primary" size="default" loading={isUpdating} onClick={this.onSave}>Save</Button>
                  </Col>
                </Row>
              </Col>
              <Col xs={2} />
              <Col xs={11}>
                <Row>
                  <h3>Tags</h3>
                </Row>
                <div>
                  {displayTags}
                </div>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }
}

export default observer(Account);
