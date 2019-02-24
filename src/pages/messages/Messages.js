import React, { Component } from 'react';
import firebase from 'firebase';

import { Typography, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';

// import SimpleBar from 'simplebar-react';

import 'simplebar/dist/simplebar.min.css';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2,
    // background: theme.palette.status.danger,
    border: '1px solid #000',
    height: '90vh',
    maxWidth: '600px',
    margin: 'auto',
    boxSize: 'border-box'
    // marginTop: '30px',
    // marginBottom: '30px',
    // padding: '20px'
  },
  message1: {
    height: '95%',
    position: 'relative'
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
    height: '75vh',
    // overflow: 'auto',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',

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
    width: '100%',
    margin: 0
  },
  messageInput: {
    display: 'flex',
    alignItems: 'center',

    position: 'absolute',
    bottom: 0,
    width: '100%'

    // background: '#ddd',
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

  // TODO: get older messages when user scrolls top
  // fetch the data with the new limit and change the state
  // add the new messages to the beginning of the allMessages array
  handleScroll = () => {
    const list = this.messages.current;
    console.log(list.scrollTop);

    if (!list.scrollTop) {
      console.log('yo');

      // const dbRef = firebase.database().ref();

      // const messagesRef = dbRef.child(
      //   'messages/' + this.props.match.params.chatId
      // );

      let messages = this.state.allMessages;
      let lastId = messages[0];

      console.log(lastId);

      // gets us only the last 10 messages
      // messagesRef.limitToLast(limit).on('child_added', snap => {
      // messagesRef.startAt(0, )limitToFirst(5).on('child_added', snap => {

      // let message = snap.val();
      // messages.push(message);

      // this.setState({
      //   allMessages: messages,
      //   loading: false
      // });

      // this.updateScrool();
      // });

      // const m = this.state.allMessages;

      // m.unshift(
      //   { msg: 'this message was added' },
      //   { msg: 'this message was added too' }
      // );

      // console.log(m);

      // this.setState({
      //   allMessages: m
      // });
    }
  };

  updateScrool = () => {
    try {
      const list = this.messages.current;

      console.log('top:', list.scrollTop);
      console.log('height:', list.scrollHeight);

      if (list.scrollTop >= 0) list.scrollTop = list.scrollHeight;
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {

    console.log('welcome to muto!');

    const dbRef = firebase.database().ref();

    const messagesRef = dbRef.child(
      'messages/' + this.props.match.params.chatId
    );

    const getMessages = limit => {
      let messages = [];
      // gets us only the last 10 messages
      // messagesRef.limitToLast(limit).on('child_added', snap => {
      messagesRef.limitToLast(10).on('child_added', snap => {
        // messagesRef.on('child_added', snap => {
        let message = snap.val();
        console.log(snap.key);

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
      getMessages(10);
    };

    messagesRef.once('value', snapshot => {
      if (!snapshot.exists()) {
        createChat();
      } else {
        getMessages(10);
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

      // message validation
      if (this.state.inputMessage) {
        firebase
          .database()
          .ref()
          .update(updates);
      } else {
        console.log('empty message cannot be added');
      }
    };

    writeNewPost();

    this.setState({
      inputMessage: ''
    });

    // Update the messages list
    setTimeout(() => {
      this.updateScrool();
    }, 100);
  };

  // TODO: you can probably remove this
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
    // var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    // var sec = a.getSeconds();

    // var time =
    //   date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;

    const time = `${date} ${month} - ${hour}:${min}`;

    return time;
  }

  render() {
    const { classes } = this.props;
    const { uid, loading, allMessages } = this.state;

    const messagesT = allMessages.map((msg, i) => {
      if (msg.sender === uid) {
        return (
          <li
            key={i}
            className={classes.sent}
            style={{ whiteSpace: 'pre-line' }}
          >
            {msg.msg}
            <p style={{ fontSize: '8px' }}>{this.timeConverter(msg.time)}</p>
          </li>
        );
      }

      return (
        <li
          key={i}
          style={{ whiteSpace: 'pre-line' }}
          className={classes.gotten}
        >
          {msg.msg}
          <p style={{ fontSize: '8px' }}>{this.timeConverter(msg.time)}</p>
        </li>
      );
    });

    return (
      <div className={classes.root} elevation={1}>
        <Typography style={{ textAlign: 'center' }} variant="h5" component="h3">
          Mr Bean
        </Typography>
        {!loading ? (
          <div className={classes.message1}>
            {/* <SimpleBar
              // onScroll={this.handleScroll}
              style={{ width: '600px' }}
              className={classes.message}
              onClick={this.updateScrool}
              ref={this.messages}
            >
              <button>load more</button>
              {messagesT}
            </SimpleBar> */}

            <ul
              onScroll={this.handleScroll}
              ref={this.messages}
              className={classes.message}
            >
              {messagesT}
            </ul>

            <form onSubmit={this.handleMessage}>
              <div className={classes.messageInput}>
                {/* TODO: submit when user hits enter */}
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

                {/* <button type="submit"> */}
                <SendIcon onClick={this.handleMessage} />
                {/* </button> */}
              </div>
            </form>
          </div>
        ) : (
          <p>loading</p>
        )}
      </div>
    );
  }
}

const withRoutes = withRouter(Messages);
export default withStyles(styles)(withRoutes);
