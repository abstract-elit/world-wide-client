import React, { Component } from 'react';
import firebase from 'firebase';

export default class SignUp extends Component {
  state = {
    title: '',
    content: ''
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const dbRef = firebase.database().ref();
    const usersRef = dbRef.child('users');

    const newUser = {
      name: 'emerson',
      age: 22,
      email: 'lupuselit@gmail.com'
    };

    usersRef.push(newUser, function() {
      console.log('data has been inserted');
    });

    console.log('submitted');
  };

  render() {
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <label>
            title
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </label>

          <label>
            content
            <input
              type="text"
              name="content"
              value={this.state.content}
              onChange={this.handleChange}
            />
          </label>

          <input onClick={this.handleSubmit} type="submit" value="Submit" />
        </form>
      </section>
    );
  }
}
