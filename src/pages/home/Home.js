import React, { Component } from 'react';

export default class SignUp extends Component {
  state = {
    users: []
  };

  render() {
    const users = this.state.users.map(user => (
      <div>
        <h1>user.name</h1>
      </div>
    ));

    return (
      <section>
        <h1>All users:</h1>
        {users}
      </section>
    );
  }
}
