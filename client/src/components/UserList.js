import React, { Component } from 'react';
import { Link } from 'react-router';

import api from '../utils/api';

export default class UserList extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      users: []
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const users = await api.getUsers();
    console.log(users);
    this.setState({ isLoading: false, users });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }
    let content;
    if (this.state.users.length) {
      content = this.state.users.map(user => {
        return (
          <p key={user.id}>
            <Link to={`/users/${user.id}`}>
              {user.name}
            </Link>
          </p>
        );
      });
    } else {
      content = <p>Doesn't look like there's anyone here.</p>
    }
    return (
      <div>
        <h1 className="title">Existing users</h1>
        <hr />
        {content}
      </div>
    );
  }
}
