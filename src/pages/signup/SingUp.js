import React, { Component } from 'react';
import firebase from 'firebase';
import firebaseConfig from '../../config';

firebase.initializeApp(firebaseConfig);

export default class SignUp extends Component {
  state = {
    email: '',
    password: '',
    user: []
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
      .then(() => {
        console.log('logged in!');
      })
      .catch(function(err) {
        // Handle errors
        console.log(err);
      });

    console.log(this.state);

    /*
    // Signup Method
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        let user = firebase.auth().currentUser;
        console.log(user);
        user
          .updateProfile({
            displayName: 'robert jonson',
            photoURL: 'https://example.com/jane-q-user/profile.jpg'
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

    */
  };

  showUser = () => {
    let user = firebase.auth().currentUser;
    console.log(user);
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        console.log('logout user');
      })
      .catch(function(error) {
        // An error happened.
        console.log(error);
      });
  };

  render() {
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <label>
            email
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </label>

          <label>
            password
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </label>

          <input onClick={this.handleSubmit} type="submit" value="Submit" />
        </form>

        <button onClick={this.showUser}>Get user</button>

        <button onClick={this.logout}>logout</button>
      </section>
    );
  }
}
