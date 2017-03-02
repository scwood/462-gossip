import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Route, Router, browserHistory } from 'react-router';

import './index.css';
import Main from './components/Main';
import UserList from './components/UserList';
import User from './components/User';
import OAuth from './components/OAuth';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={Main}>
      <Route path="/users" component={UserList} />
      <Route path="/users/:id" component={User} />
    </Route>
    <Route path="/oauth" component={OAuth} />
    <Redirect from="*" to="/users" />
  </Router>,
  document.getElementById('root')
);
