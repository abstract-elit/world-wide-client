import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
