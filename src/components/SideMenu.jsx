import React from 'react';
import { Layout, Icon, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './components.module.css';

const menuItems = [
  {
    key: 'news',
    name: 'News',
    icon: 'bars',
  },
  {
    key: 'recommendations',
    name: 'Recommendations',
    icon: 'search',
  },
  {
    key: 'answers',
    name: 'Answers',
    icon: 'message',
  },
  {
    key: 'account',
    name: 'Account',
    icon: 'user',
  },
];

class SideMenu extends React.Component {
  handleSelect = ({
    item, key,
  }) => {
    const { history } = this.props;
    history.push(`/site/${key}`);
  }

  render() {
    const { history } = this.props;

    return (
      <Layout.Sider theme="light" className={styles.sider}>
        <div className={styles.logo}>
          <a href="/">Stay in Touch</a>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[history.location.pathname.slice(6)]}
          onSelect={this.handleSelect}
          className={styles.menu}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} className={styles.menuItem}>
              <Icon type={item.icon} />
              <span>{item.name}</span>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Sider>
    );
  }
}

export default withRouter(SideMenu);
