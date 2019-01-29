import React, { Component } from 'react';
import firebase from 'firebase';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  card: {
    maxWidth: '200px',
    margin: '10px'
  },
  allUsers: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  message: {
    // background: 'red'
  },
  gotten: {
    textAlign: 'left',
    listStyle: 'none',
    background: '#faa'
  },
  sent: {
    textAlign: 'right',
    listStyle: 'none',
    background: '#3ea'
  }
});

class Messages extends Component {
  state = {
    allMessages: [],
    loading: true,
    uid: localStorage.getItem('uid'),
    inputMessage: ''
  };

  componentDidMount() {
    const dbRef = firebase.database().ref();

    const messagesRef = dbRef.child(
      'messages/' + this.props.match.params.chatId
    );

    const getMessages = () => {
      let messages = [];
      messagesRef.on('child_added', snap => {
        let message = snap.val();
        messages.push(message);
        this.setState({
          allMessages: messages,
          loading: false
        });
      });
    };

    const createChat = () => {
      let postMessage = {
        msg: '',
        time: '',
        sender: '',
        reciver: ''
      };

      let newPostKey = firebase
        .database()
        .ref('messages')
        .child(this.props.match.params.chatId)
        .push().key;

      var updates = {};
      updates[
        `/messages/${this.props.match.params.chatId}/${newPostKey}`
      ] = postMessage;

      firebase
        .database()
        .ref()
        .update(updates);
      getMessages();
    };

    messagesRef.once('value', snapshot => {
      if (!snapshot.exists()) {
        createChat();
      } else {
        getMessages();
      }
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleMessage = event => {
    event.preventDefault();

    const writeNewPost = (uid, username, picture, title, body) => {
      const chatId = this.props.match.params.chatId;
      const reciverId = chatId.split('_').filter(id => id !== this.state.uid);

      var postMessage = {
        msg: this.state.inputMessage,
        time: Math.round(+new Date() / 1000),
        sender: this.state.uid,
        reciver: reciverId[0]
      };

      console.log(postMessage, chatId);

      // Creates a new key for the message and retrives it
      var newPostKey = firebase
        .database()
        .ref('messages')
        .child(chatId)
        .push().key;

      var updates = {};
      updates[`/messages/${chatId}/${newPostKey}`] = postMessage;

      return firebase
        .database()
        .ref()
        .update(updates);
    };

    writeNewPost();

    this.setState({
      inputMessage: ''
    });
  };

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  render() {
    const { classes } = this.props;
    const { uid, loading, allMessages } = this.state;

    const messagesT = allMessages.map(msg => {
      if (msg.sender === uid) {
        return <li className={classes.sent}>{msg.msg}</li>;
      }

      return <li className={classes.gotten}>{msg.msg}</li>;
    });

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          this is the message component
        </Typography>
        {!loading ? (
          <div className={classes.message}>
            <ul>{messagesT}</ul>

            <form onSubmit={this.handleMessage}>
              <input
                name="inputMessage"
                onChange={this.handleChange}
                type="text"
                value={this.state.inputMessage}
              />
              <input value="send" type="submit" />
            </form>
          </div>
        ) : (
          <p>loading</p>
        )}
      </Paper>
    );
  }
}

const withRoutes = withRouter(Messages);
export default withStyles(styles)(withRoutes);
