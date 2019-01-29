import React, { Component } from 'react';
import firebase from 'firebase';
import './SignUp.css';

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

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    photoURL: '',
    username: '',
    user: []
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    // Signup Method
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log('user created');

        let user = firebase.auth().currentUser;
        console.log(user);
        user
          .updateProfile({
            displayName: this.state.name,
            photoURL: this.state.photoURL
          })
          .then(() => {
            this.setState({
              user: firebase.auth().currentUser
            });
            console.log('sucess');
            user
              .sendEmailVerification()
              .then(function() {
                // Email sent.
                console.log('email sent!');
              })
              .catch(function(error) {
                // An error happened.
                console.log(error);
              });
          })
          .then(() => {
            const {
              email,
              displayName,
              photoURL
            } = this.state.user.providerData[0];
            firebase
              .database()
              .ref('users/' + this.state.user.uid)
              .set({
                name: displayName,
                email: email,
                photoURL: photoURL,
                userId: this.state.user.uid,
                username: this.state.username
              });

            localStorage.setItem('name', displayName);
            localStorage.setItem('email', email);
            localStorage.setItem('photo', photoURL);
            localStorage.setItem('username', this.state.username);
            localStorage.setItem('uid', this.state.user.uid);

            // should redirect the user to their profile
            // this.history.push('/profile')
          })
          .catch(function(error) {
            // An error happened.
            console.log(error);
          });
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });

    // */
  };

  showUser = () => {
    let user = firebase.auth().currentUser;
    console.log(user);
  };

  render() {
    const { classes } = this.props;
    return (
      <section className="SignUp">
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <TextField
            label="Name"
            name="name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Username"
            name="username"
            className={classes.textField}
            value={this.state.username}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="email"
            name="email"
            type="email"
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
          <TextField
            label="photoURL"
            name="photoURL"
            type="text"
            className={classes.textField}
            value={this.state.photoURL}
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
      </section>
    );
  }
}

export default withStyles(styles)(SignUp);
