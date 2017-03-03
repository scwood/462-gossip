import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Route, Router, browserHistory } from 'react-router';

import './index.css';
import Main from './components/Main';
import OAuth from './components/OAuth';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/messages" component={Main} />
    <Route path="/oauth" component={OAuth} />
    <Redirect from="*" to="/messages" />
  </Router>,
  document.getElementById('root')
);
