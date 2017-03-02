import React from 'react';

import Header from './Header';
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
      isLoggedIn: false
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const self = await api.getSelf();
    this.setState({ isLoading: false, self });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }
    return (
      <section className="section">
        <div className="container" style={style}>
          <Header user={this.state.self} />
          {this.props.children}
        </div>
      </section>
    );
  }
}

export default Main;
