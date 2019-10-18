import React from 'react';
import {
  Switch, Route, withRouter, Redirect,
} from 'react-router-dom';
import { Row, Col } from 'antd';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import styles from './Auth.module.css';

const Auth = ({ history }) => (
  <Row>
    <Redirect to="/auth" />
    <Col xs={4} sm={8} />
    <Col xs={16} sm={8}>
      <div className={styles.logo}>
        Stay in Touch
      </div>
      <div className={styles.explanation}>
        {history.location.pathname.slice(6) === 'login' ? 'Please, log in to proceed' : 'Create new account'}
      </div>
      <Switch>
        <Route exact path="/auth" render={() => <Redirect to="/auth/login" />} />
        <Route exact path="/auth/login" component={LoginForm} />
        <Route exact path="/auth/register" component={RegisterForm} />
      </Switch>
    </Col>
    <Col xs={4} sm={8} />
  </Row>
);

export default withRouter(Auth);
