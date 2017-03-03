import React from 'react';

import Header from './Header';
import MessageList from './MessageList';
import api from '../utils/api';

const style = {
  maxWidth: 600,
  margin: '0px auto',
  marginTop: 30,
}

class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      usersCount: 'loading...',
      user: null
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [user, usersCount] = await Promise.all(
      [api.getSelf(), api.getUsersCount()]
    );
    this.setState({ isLoading: false, user, usersCount });
  }

  render() {
    return (
      <section className="section">
        <div className="container" style={style}>
          {this.state.isLoading || <Header user={this.state.user} />}
          <h1 className="title">Info</h1>
          <hr />
          <p>
            Every time a user registers through Foursquare a new node is
            created.
          </p>
          <p>Current node count: {this.state.usersCount}.</p>
          <br /><br />
          <MessageList user={this.state.user} />
        </div>
      </section>
    );
  }
}

export default Main;
