import { Component } from 'react';
import { browserHistory } from 'react-router';

import api from '../utils/api';

export default class OAuth extends Component {

  async componentDidMount() {
    await api.login(this.props.location.query.code)
    browserHistory.replace('/');
  }

  render() {
    return null;
  }
}
