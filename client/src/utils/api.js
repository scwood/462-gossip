import fetch from 'isomorphic-fetch';

class Api {

  async getUsers() {
    const result =  await this.fetchJson('/api/users');
    return result.users;
  }

  async getUser(id) {
    const result =  await this.fetchJson(`/api/users/${id}`);
    return result.user;
  }

  async getSelf() {
    const result = await this.fetchJson(`/api/users/self`);
    return result.self;
  }

  async login(code) {
    await this.fetchJson(`/api/users/${code}/login`);
  }

  async logout() {
    await this.fetchJson('/api/users/logout')
  }

  async fetchJson(...args) {
    const result = await fetch(...args, { credentials: 'same-origin' });
    return await result.json();
  }
}

export default new Api();
