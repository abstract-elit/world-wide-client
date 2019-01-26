import React, { Component } from 'react';
import firebase from 'firebase';

export default class SignUp extends Component {
  state = {
    users: [],
    loading: true
  };

  componentDidMount() {
    console.log('home!');
    const dbRef = firebase.database().ref();
    const usersRef = dbRef.child('users');

    console.log(usersRef);

    let users = [];
    usersRef.on('child_added', snap => {
      let user = snap.val();
      users.push(user);

      this.setState({
        users: users,
        loading: false
      });
    });
  }

  deleteUser = () => {
    // const userID = e.target.getAttribute('userid');
    // const userRef = dbRef.child('users/' + userID);
    // userRef.remove();
  };

  render() {
    const renderU = this.state.users.map(user => <p>{user.name}</p>);

    return (
      <section>
        <h1>All users:</h1>
        {this.state.loading ? <p>loading</p> : renderU}

        <button onClick={this.deleteUser}>delete user</button>
      </section>
    );
  }
}
