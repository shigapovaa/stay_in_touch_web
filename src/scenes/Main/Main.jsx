import React from 'react';
import { Layout } from 'antd';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import News from './scenes/News';
import styles from './Main.module.css';
import Recommendations from './scenes/Recommendations';
import Account from './scenes/Account';
import Answers from './scenes/Answers';

const Main = ({ history }) => (
  <>
    <SideMenu />
    <Layout>
      <Header />
      <Layout.Content className={styles.contentPadding} style={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 110px)' }}>
        {!history.location.pathname.includes('site') && <Redirect to="/site" />}
        <Route exact path="/site" component={News} />
        <Route exact path="/site/news" component={News} />
        <Route exact path="/site/recommendations" component={Recommendations} />
        <Route exact path="/site/account" component={Account} />
        <Route exact path="/site/answers" component={Answers} />
      </Layout.Content>
      <Layout.Footer style={{
        textAlign: 'center', width: '100%', padding: '8px',
      }}
      >
Powered by
        {' '}
        <a href="https://kpfu.ru/itis">HS ITIS of Kazan Federal University</a>
      </Layout.Footer>
    </Layout>
  </>
);

export default observer(withRouter(Main));
