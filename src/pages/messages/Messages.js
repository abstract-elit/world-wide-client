import React, { Component } from 'react';
import firebase from 'firebase';

import { Typography, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    // background: theme.palette.status.danger,
    // border: '1px solid #000',
    height: '80vh',
    maxWidth: '600px',
    margin: 'auto',
    boxSize: 'border-box',
    marginTop: '30px',
    marginBottom: '30px',
    padding: '20px'
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
    // background: 'red',
    margin: 0,
    padding: 0,
    height: '60vh',
    overflow: 'auto',
    possition: 'relative'
  },
  gotten: {
    // The first message will always be empty, so when won't show it
    '&:first-child': {
      display: 'none'
    },
    textAlign: 'left',
    listStyle: 'none',
    // background: theme.palette.primary.light,
    background: '#3ea',
    padding: '20px',
    margin: '5px 0',
    borderRadius: '10px'
  },
  sent: {
    '&:first-child': {
      display: 'none'
    },

    textAlign: 'right',
    listStyle: 'none',

    // border: '1px solid #000',
    background: '#edf5e1',
    padding: '20px',
    margin: '5px 0',
    borderRadius: '10px'
  },
  input: {
    // height: '50px',
    // width: '480px',
    // margin: '0 20px 20px',
    // borderRadius: '20px',
    // border: '2px solid #97caef',
    // fontFamily: 'inherit',
    // fontSize: '100%',
    // padding: '10px 10px',
    // height: '100px',

    // '&[contenteditable]': {
    //   overflow: 'auto',
    //   maxHeight: '400px'
    // },
    // outline: 'none'
    width: '100%'
    // position: 'absolute',
    // margin: 'auto',
    // bottom: '50px'
    // textAlign: 'center'
  },
  messageInput: {
    background: '#ddd'
  }
});

class Messages extends Component {
  state = {
    allMessages: [],
    loading: true,
    uid: localStorage.getItem('uid'),
    inputMessage: ''
  };

  messages = React.createRef();

  updateScrool = () => {
    const list = this.messages.current;
    // console.log(list);
    list.scrollTop = list.scrollHeight;
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

        this.updateScrool();
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

    // Update the messages list
    setTimeout(() => {
      this.updateScrool();
    }, 500);
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

    const messagesT = allMessages.map((msg, i) => {
      if (msg.sender === uid) {
        return (
          <li key={i} className={classes.sent}>
            {msg.msg}
          </li>
        );
      }

      return <li className={classes.gotten}>{msg.msg}</li>;
    });

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography style={{ textAlign: 'center' }} variant="h5" component="h3">
          Mr Bean
        </Typography>
        {!loading ? (
          <div className={classes.message1}>
            <ul ref={this.messages} className={classes.message}>
              {messagesT}
            </ul>

            <form
              style={{ width: 'auto', margin: 'auto' }}
              onSubmit={this.handleMessage}
            >
              {/* <textarea
                autoComplete="false"
                focus
                name="inputMessage"
                onChange={this.handleChange}
                type="text"
                placeholder="write your message..."
                value={this.state.inputMessage}
                className={classes.input}
              /> */}

              <div className={classes.messageInput}>
                <TextField
                  id="outlined-multiline-flexible"
                  type="submit"
                  label="write something ..."
                  multiline
                  rowsMax="3"
                  name="inputMessage"
                  onChange={this.handleChange}
                  value={this.state.inputMessage}
                  className={classes.input}
                  margin="normal"
                  // helperText="Send a message"
                  variant="outlined"
                />

                <button type="submit">
                  <SendIcon />
                </button>

                {/* <input value="send" type="submit" /> */}
              </div>
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
