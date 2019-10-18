import React from 'react';
import {
  Layout, Spin, Row, Col,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { reaction, toJS } from 'mobx';
import Cookies from 'js-cookie';
import authStore from './store/authStore';
import tagsStore from './store/tagsStore';
import { checkAuth } from './api/auth';
import Auth from './scenes/Auth/Auth';
import Main from './scenes/Main/Main';

import 'antd/dist/antd.css';

const App = observer(
  class App extends React.Component {
    state = {
      isLoading: true,
    };

    componentDidMount() {
      this.userDataListener = reaction(
        () => authStore.userData,
        (userData) => console.log(toJS(userData)),
      );

      this.tokenListener = reaction(
        () => authStore.token,
        () => {
          this.setState({
            isLoading: true,
          }, () => {
            checkAuth().then((result) => {
              const {
                first_name: firstName, last_name: lastName, username, email, id,
              } = result.data;
              const { photo_url: photoUrl, tags } = result.data.profile;

              authStore.setUserData({
                firstName, lastName, username, email, id, photoUrl, tags,
              });
              tagsStore.setTags(tags);
            }).finally(() => {
              this.setState({
                isLoading: false,
              });
            });
          });
        },
      );

      this.refreshUserStatus();
    }

    refreshUserStatus = () => {
      this.setState({
        isLoading: true,
      },
      () => {
        checkAuth().then((result) => {
          const {
            first_name: firstName, last_name: lastName, username, email, id,
          } = result.data;
          const { photo_url: photoUrl, tags } = result.data.profile;

          authStore.setToken(Cookies.get('stay-in-touch-token'));
          authStore.setUserData({
            firstName, lastName, username, email, id, photoUrl,
          });
          tagsStore.setTags(tags);
        }).finally(() => {
          this.setState({
            isLoading: false,
          });
        });
      });
    }

    render() {
      const { isAuth } = authStore;
      const { isLoading } = this.state;

      return (
        <Layout style={{ minHeight: '100vh' }}>
          {isLoading ? (
            <Row type="flex" align="middle" justify="center" style={{ height: '100vh', width: '100%' }}>
              <Col>
                <Spin size="large" tip="Please, wait..." />
              </Col>
            </Row>
          ) : (
            <>
              {isAuth ? (
                <Main />
              ) : (
                <Auth />
              )}

            </>
          )}

        </Layout>
      );
    }
  },
);

export default withRouter(App);
