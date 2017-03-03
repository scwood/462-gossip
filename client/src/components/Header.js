import React, { Component } from 'react';

import api from '../utils/api'; export default class Header extends Component {

  constructor() {
    super();
    this.state = {
      foursquareUrl: this.generateFoursquareUrl()
    };
  }

  generateFoursquareUrl() {
    let clientId;
    const { hostname, host, protocol } = window.location;
    if (hostname === 'localhost') {
      clientId = 'QNFMWHEOOBPYPRK1OWG3GBYEOQL4H1URCZ15TS2NSTCWOWMQ';
    } else {
      clientId = 'RKQFRFZZNJIRTFOLECEUTE4VHKRPE0EIF2QGPJ0QFVXC3K3T';
    }
    const redirectUri = `${protocol}//${host}/oauth`
    return 'https://foursquare.com/oauth2/authenticate?'
      + `client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`
  }

  async handleLogoutClick() {
    await api.logout();
    location.reload();
  }

  render() {
    let button;
    if (this.props.user) {
      button = (
        <a className="button" onClick={this.handleLogoutClick}>Logout</a>
      );
    } else {
      button = (
        <a href={this.state.foursquareUrl} className="button is-info">
          Login with Foursquare
        </a>
      );
    }
    return (
      <div style={{ marginBottom: 50 }}>
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title is-4">
                Gossip Messenger
              </h1>
            </div>
          </div>
          <div className="level-right">
            {this.props.user && (
              <p className="level-item">
                {this.props.user.name}
              </p>
            )}
            <p className="level-item">
              {button}
            </p>
          </div>
        </nav>
      </div>
    );
  }
}
