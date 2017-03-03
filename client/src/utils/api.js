import fetch from 'isomorphic-fetch';

class Api {

  async getUsersCount() {
    const result =  await this.fetchJson('/api/users/count');
    return result.usersCount;
  }

  async getSelf() {
    const result = await this.fetchJson(`/api/users/self`);
    return result.self;
  }

  async postMessage(text, user) {
    const nextMessageSequence = await this.getNextMessageSequence(user.uri);
    const message = {
      rumor: {
        messageId: `${user.id}:${nextMessageSequence}`,
        originator: user.name,
        text,
      },
      endPoint: this.deriveUrl(user.uri)
    };
    await this.fetchJson(message.endPoint, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(message)
    });
  }

  async getNextMessageSequence(uri) {
    const result = await this.fetchJson(`${uri}/next`);
    return result.nextMessageSequence;
  }

  async login(code) {
    await this.fetchJson(`/api/users/${code}/login`);
  }

  async logout() {
    await this.fetchJson('/api/users/logout')
  }

  async fetchJson(url, config) {
    const result = await fetch(url, { ...config, credentials: 'same-origin' });
    return await result.json();
  }

  deriveUrl(uri) {
    const { protocol, host } = window.location
    return `${protocol}//${host}${uri}`;
  }
}

export default new Api();
