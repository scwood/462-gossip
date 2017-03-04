import React, { Component } from 'react';

import Error from './Error';
import Message from './Message';
import api from '../utils/api';
import handleFieldChange from '../utils/handleFieldChange';

export default class MessageList extends Component {

  constructor(props) {
    super(props);
    this.state = { text: '', error: null };
    this.handleErrorDismiss = this.handleErrorDismiss.bind(this);
    this.handleSubmitMessageClick = this.handleSubmitMessageClick.bind(this);
    this.handleFieldChange = handleFieldChange.bind(this);
  } 

  handleErrorDismiss() {
    this.setState({ error: '' });
  }

  async handleSubmitMessageClick() {
    if (this.state.text.trim() === '') {
      this.setState({ error: 'Message must have text.' });
      return;
    }
    await api.postMessage(this.state.text, this.props.user);
    location.reload();
    this.setState({ error: null, text: '' });
  }

  render() {
    let content;
    const { user } = this.props;
    const { text, error } = this.state;
    if (user) {
      content = user.messages.map(message => {
        return (
          <Message key={message.messageId} name={message.originator}>
            {message.text}
          </Message>
        );
      });
      content.unshift(
        <div key="messageForm">
          <p className="control">
            <textarea
              className="textarea"
              onChange={this.handleFieldChange('text')}
              placeholder="Write a new message"
              value={text}>
            </textarea>
          </p>
          <p className="control">
            <button className="button is-info" onClick={this.handleSubmitMessageClick}>
              Submit
            </button>
          </p>
          <br />
        </div>
      );
    } else {
      content = <p>Login to view and send messages.</p>
    }
    return (
      <div>
        <h1 className="title">Messages</h1>
        <hr />
        {error && <Error onDismiss={this.handleErrorDismiss}>{error}</Error>}
        {content}
      </div>
    );
  }
}
