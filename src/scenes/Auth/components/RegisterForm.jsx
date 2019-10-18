import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Form, Input, Button, Row, Col, notification,
} from 'antd';
import styles from './components.module.css';
import { signUp } from '../../../api/auth';
import authStore from '../../../store/authStore';

class RegisterFormComponent extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();
    const { form, history } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        signUp({ ...values }).then((result) => {
          const { user, token } = result;
          const {
            first_name: firstName, last_name: lastName, email, username,
          } = user;
          authStore.setToken(token);
          authStore.setUserData({
            firstName, lastName, email, username,
          });
          history.push('/');
        }).catch((err) => {
          notification.error({ message: 'Error!', description: 'Error occurred on sign up', placement: 'bottomRight' });
        });
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password1')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Item>
          {getFieldDecorator('first_name', {
            rules: [
              {
                required: true,
                message: 'Please, enter your first name!',
              },
            ],
          })(<Input placeholder="First name" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('last_name', {
            rules: [
              {
                required: true,
                message: 'Please, enter your last name!',
              },
            ],
          })(<Input placeholder="Last name" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'This is not valid e-mail!',
              },
              {
                required: true,
                message: 'Please, enter e-mail!',
              },
            ],
          })(
            <Input placeholder="E-mail" />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password1', {
            rules: [
              {
                required: true,
                message: 'Please, enter password!',
              },
            ],
          })(<Input.Password placeholder="Password" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password2', {
            rules: [
              {
                required: true,
                message: 'Please, confirm password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password placeholder="Confirm password" />)}
        </Form.Item>
        <Form.Item>
          <Row>
            <Col xs={6} />
            <Col xs={18} className={styles.formFooter}>
              <Link to="/auth/login">Cancel</Link>
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" htmlType="submit">Sign Up</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

const RegisterForm = Form.create({ name: 'register_form' })(RegisterFormComponent);

export default withRouter(RegisterForm);
