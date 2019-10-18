import React from 'react';
import { Link } from 'react-router-dom';
import {
  Form, Button, Input, Row, Col, notification,
} from 'antd';
import Cookies from 'js-cookie';
import authStore from '../../../store/authStore';
import { login } from '../../../api/auth';
import styles from './components.module.css';

class LoginFormComponent extends React.Component {
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { email: eMail, password } = values;
      if (!err) {
        login(eMail, password).then((result) => {
          const { token, user } = result.data;
          const {
            username, email, first_name: firstName, last_name: lastName,
          } = user;
          const jwtToken = `JWT ${token}`;
          Cookies.set('stay-in-touch-token', jwtToken);
          authStore.setToken(token);
          authStore.setUserData({
            firstName, lastName, username, email,
          });
        }).catch((err) => {
          notification.error({ message: 'Error!', description: 'Error occurred on login', placement: 'bottomRight' });
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please, enter e-mail!',
              },
              {
                type: 'email',
                message: 'This is not valid e-mail!',
              },
            ],
          })(
            <Input
              placeholder="E-mail"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please, enter password!' }],
          })(
            <Input.Password
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Row type="flex" justify="space-between">
            <Col xs={6} />
            <Col xs={18} className={styles.formFooter}>
              <Link to="/auth/register">Sign Up</Link>
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" htmlType="submit">
              Sign In
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

const LoginForm = Form.create({ name: 'login_form' })(LoginFormComponent);

export default LoginForm;
