import React, { Component } from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';

import firebase from 'firebase';

import SignUp from './pages/signup/SingUp';
import NewPost from './pages/posts/NewPost';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import MenuIcon from '@material-ui/icons/Menu';

import './App.css';
import UserProfile from './pages/profile/UserProfile';
import Messages from './pages/messages/Messages';

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  link: {
    color: '#fff',
    textDecoration: 'none'
  }
};

class App extends Component {
  state = {
    user: {}
  };

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('photo');
        console.log('logout user');
      })
      .catch(function(error) {
        // An error happened.
        console.log(error);
      });
  };

  componentDidMount() {
    console.log(localStorage.getItem('name'));

    const user = {
      name: localStorage.getItem('name'),
      photo: localStorage.getItem('photo'),
      email: localStorage.getItem('email')
    };

    this.setState({ user });
  }

  getUser = () => {
    let user = firebase.auth().currentUser;
    // console.log(user.displayName);
    if (user) {
      console.log(user.uid);
      this.props.history.push('my-profile');
      console.log('user logged');
    } else {
      console.log('no user logged');
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                <Link className={classes.link} to="/">
                  Home
                </Link>
              </Typography>

              {this.state.user.name === null ? (
                <Button color="inherit">
                  <Link className={classes.link} to="/login">
                    Login
                  </Link>
                </Button>
              ) : (
                <Button onClick={this.handleLogout} color="inherit">
                  Logout
                </Button>
              )}

              {/* <Button color="inherit">
                  <Link className={classes.link} to="/signup">
                    Sign Up
                  </Link>
                </Button> */}

              <Button onClick={this.getUser} color="inherit">
                Get User
              </Button>

              {/* <Button color="inherit">
                <Link to="/profile/:id"></Link>
              </Button> */}
            </Toolbar>
          </AppBar>
        </div>
        {/* <header className="App-header">
          <Typography>welcome to world wide!</Typography>
        </header> */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/my-profile" component={Profile} />
          <Route exact path="/profile/:userId" component={UserProfile} />
          <Route exact path="/messages/chat/:chatId" component={Messages} />
        </Switch>
        {/* <NewPost /> */}
      </div>
    );
  }
}

const withRoutes = withRouter(App);
export default withStyles(styles)(withRoutes);
