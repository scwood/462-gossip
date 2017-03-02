const fetch = require('isomorphic-fetch');

class Api {

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.clientId = 'RKQFRFZZNJIRTFOLECEUTE4VHKRPE0EIF2QGPJ0QFVXC3K3T';
      this.clientSecret = 'WKGTHNTQ5FJCPFOLMYDKWPTCJ4R0SZHKR1Z3RALORQ155WOA';
      this.redirectUri = 'https://oauth.462.spncrwd.com/oauth';
    } else {
      this.clientId = 'QNFMWHEOOBPYPRK1OWG3GBYEOQL4H1URCZ15TS2NSTCWOWMQ';
      this.clientSecret = 'QMISANVAWNINSV0103OZJK2CV2HPEYLQAPDARQD2U23IVZWJ'; this.redirectUri = 'http://localhost:3000/oauth';
    }
    this.baseUrl = 'https://api.foursquare.com/v2';
  }

  generateUrl(uri) {
    return this.baseUrl + uri + '?v=20160214';
  }

  async getUser(accessToken) {
    const url = this.generateUrl('/users/self') + `&oauth_token=${accessToken}`;
    const result = await this.fetchJson(url);
    return result.response.user;
  }

  async getAccessToken(code) {
    const url = 'https://foursquare.com/oauth2/access_token?'
      + `client_id=${this.clientId}`
      + `&client_secret=${this.clientSecret}`
      + `&grant_type=authorization_code`
      + `&redirect_uri=${this.redirectUri}`
      + `&code=${code}`;
    const result = await this.fetchJson(url);
    return result.access_token;
  }

  async getUserCheckins(accessToken) {
    const url = this.generateUrl('/users/self/checkins') + `&oauth_token=${accessToken}`;
    const response = await this.fetchJson(url);
      return response.response.checkins;
  }

  async fetchJson(...args) {
    const result = await fetch(...args);
    return await result.json();
  }
}

module.exports = new Api();
