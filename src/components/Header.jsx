import React from 'react';
import {
  Layout, Row, Col, Avatar, Button, notification, Icon,
} from 'antd';
import { observer } from 'mobx-react';
import Cookies from 'js-cookie';
import authStore from '../store/authStore';
import styles from './components.module.css';
import { logout } from '../api/auth';

const onLogoutClick = () => {
  logout().then(() => {
    authStore.setToken(null);
    authStore.resetUserData();
    Cookies.remove('stay-in-touch-token');
    Cookies.remove('csrftoken', { domain: 'localhost' });
    window.location.reload();
  }).catch(() => {
    notification.error({ message: 'Error', description: 'Error occurred on logout.', placement: 'bottomRight' });
  });
};

const Header = observer(() => {
  const { userData } = authStore;
  const { firstName, lastName, photoUrl } = userData;

  return (
    <Layout.Header className={styles.header}>
      <Row>
        <Col xs={8} />
        <Col xs={16} style={{ textAlign: 'end' }}>
          <Avatar size="default" src={photoUrl} />
          &nbsp;&nbsp;&nbsp;
          {`${firstName} ${lastName}`}
          &nbsp;&nbsp;
          <Button type="link" onClick={onLogoutClick}>Logout</Button>
        </Col>
      </Row>
    </Layout.Header>
  );
});

export default Header;
