import React, { Component } from 'react';
import firebase from 'firebase';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

import Flag from 'react-world-flags';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  avatar: {
    margin: 10,
    width: 150,
    height: 150
  }
});

const User = {
  email: 'emerson@gmail.com',
  username: 'emerson',
  photoURL: 'https://avatars0.githubusercontent.com/u/24904209?s=460&v=4',
  userId: 'ihEyfd0WnKXdonUWPNEul322KNO2',

  name: 'emersson',
  country: 'BR',
  learn: 'US',
  speak: 'BR',
  age: '22',
  bio:
    'I like everything, music, tv shows, books, tech, culture, and much more. I can talk about anything it depends on the other person.'
};

class UserProfile extends Component {
  state = {
    user: {},
    fakeUser: User,
    loading: true
  };

  componentDidMount() {
    const { userId } = this.props.match.params;
    let userRef = firebase.database().ref('users/' + userId);

    userRef.on('value', snapshot => {
      this.setState({
        user: snapshot.val(),
        loading: false
      });
    });
  }

  handleClick = event => {
    // Get the chat id
    const curId = this.props.match.params.userId;
    let user = firebase.auth().currentUser;

    let chat = '';

    if (user) {
      if (curId < user.uid) {
        chat = `${curId}_${user.uid}`;
      } else if (curId === user.uid) {
        console.log('you cant talk to yourself');
        return;
      } else {
        chat = `${user.uid}_${curId}`;
      }
    } else {
      // alert('please log in');
      this.props.history.push(`/login`);
      return;
    }

    // sending the user to the chat
    this.props.history.push(`/messages/chat/${chat}`);

    // this creates a new chatroom for the users

    // FIXME: if the convo doesnt exists it creates one with an empty conversation, the problem with this is that it creates an empty message all the time the users click message
    // let postMessage = {
    //   msg: '',
    //   time: '',
    //   sender: '',
    //   reciver: ''
    // };

    // let newPostKey = firebase
    //   .database()
    //   .ref('messages')
    //   .child(chat)
    //   .push().key;

    // var updates = {};
    // updates[`/messages/${chat}/${newPostKey}`] = postMessage;

    // firebase
    //   .database()
    //   .ref()
    //   .update(updates);
  };

  render() {
    const { classes } = this.props;
    // const { name, username, photoURL } = this.state.user;

    const { name, country, learn, speak, photoURL } = this.state.fakeUser;

    return (
      <Paper className={classes.root} elevation={1}>
        {this.state.loading ? (
          <p>loading</p>
        ) : (
          <div>
            <Avatar alt="" src={photoURL} className={classes.avatar} />
            <Typography variant="h5" component="h3">
              <Flag code={country} height="30" />
              <br />
              <Flag code={learn} height="30" />
              <br />
              <Flag code={speak} height="30" />
              {name}
            </Typography>

            <Button
              onClick={this.handleClick}
              variant="outlined"
              color="primary"
            >
              Message!
            </Button>
          </div>
        )}
      </Paper>
    );
  }
}

const withRoutes = withRouter(UserProfile);
export default withStyles(styles)(withRoutes);
