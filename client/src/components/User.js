import React, { Component } from 'react';
import api from '../utils/api';

import BackLink from './BackLink.js';
import Checkin from './Checkin.js';

export default class User extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      user: null,
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const user = await api.getUser(this.props.params.id)
    this.setState({ isLoading: false, user });
  }

  render() {
    const { user, isLoading } = this.state;
    if (isLoading || !user) {
      return null;
    }
    return (
      <div>
        <BackLink />
        <h1 className="title">{user.name}</h1>
        <hr />
        <h1 className="title is-4">Checkins</h1>
        {this.state.user && this.state.user.checkins.map((checkin, index) => {
          return (
            <Checkin data={checkin} key={`checkin-${index}`} />
          );
        })}
      </div>
    );
  }
}
