import React, { Component } from 'react';
import firebase from 'firebase';
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    maxWidth: '500px'
  }
};

class Login extends Component {
  state = {
    email: '',
    password: ''
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    // Login Method
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        // console.log(user.user);

        const { displayName, email, photoURL } = user.user.providerData[0];

        localStorage.setItem('name', displayName);
        localStorage.setItem('email', email);
        localStorage.setItem('photo', photoURL);
        localStorage.setItem('uid', user.user.uid);

        console.log('logged in!');
      })
      .catch(function(err) {
        // Handle errors
        console.log(err);
      });
  };

  showUser = () => {
    let user = firebase.auth().currentUser;
    console.log(user);
  };

  render() {
    const { classes } = this.props;
    return (
      <section className="login">
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <TextField
            label="Email"
            name="email"
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="password"
            name="password"
            type="password"
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            size="large"
            variant="outlined"
            className={classes.margin}
          >
            Submit
          </Button>
        </form>

        <Link className={classes.link} to="/signup">
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            type="button"
            className={classes.margin}
          >
            Sign Up
          </Button>
        </Link>
      </section>
    );
  }
}

const withRoutes = withRouter(Login);
export default withStyles(styles)(withRoutes);
