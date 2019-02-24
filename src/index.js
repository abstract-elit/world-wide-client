import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// const colors = {
//   first: '#fc4445',
//   second: '#3feee6',
//   third: '#55bcc9',
//   fourth: '#97caef',
//   other: '#cafafe'
// };

// const colors2 = {
//   first: '#05387b',
//   second: '#379683',
//   third: '#5cdb95',
//   fourth: '#8ee4af',
//   other: '#edf5e1'
// };

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#fc4445'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00'
    },
    masseges: {
      mainUser: '#',
      secondUser: '#'
    }
    // error: will use the default color
  },
  typography: {
    useNextVariants: true,
    main: 'red'
  }
  // typography: {}

  // palette: {
  //   primary: 'purple',
  //   secondary: 'green'
  // },
  // status: {
  //   danger: 'orange'
  // }
});

// console.log(process.env.PUBLIC_URL);

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <MuiThemeProvider theme={theme}>
      <HashRouter>
        <App />
      </HashRouter>
    </MuiThemeProvider>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
