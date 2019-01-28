import React, { Component } from 'react';
import firebase from 'firebase';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';
import { EEXIST } from 'constants';

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
    messages: {},
    allMessages: [],
    sent: [],
    gotten: [],
    loading: true,
    uid: '',
    inputMessage: ''
  };

  componentDidMount() {
    this.getUser(this.props.match.params.chatId);

    const dbRef = firebase.database().ref();

    const messagesRef = dbRef.child(
      'messages/' + this.props.match.params.chatId
    );

    let messages = [];
    messagesRef.on('child_added', snap => {
      let message = snap.val();
      messages.push(message);
      this.setState({
        allMessages: messages,
        loading: false
      });
    });
  }

  handleMessage = event => {
    event.preventDefault();

    const chatId = this.props.match.params.chatId;

    const reciverId = chatId.split('_').filter(id => id !== this.state.uid);

    console.log(reciverId[0]);

    const writeNewPost = (uid, username, picture, title, body) => {
      // A post entry.

      const chatId = this.props.match.params.chatId;
      const reciverId = chatId.split('_').filter(id => id !== this.state.uid);

      var postMessage = {
        msg: this.state.inputMessage,
        time: Math.round(+new Date() / 1000),
        sender: this.state.uid,
        reciver: reciverId[0]
      };

      console.log(postMessage, chatId);

      // Get a key for a new Post.
      var newPostKey = firebase
        .database()
        .ref('messages')
        .child(chatId)
        .push().key;

      console.log(newPostKey);

      // // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates[`/messages/${chatId}/${newPostKey}`] = postMessage;

      return firebase
        .database()
        .ref()
        .update(updates);
    };

    // console.log(event.target.value);

    writeNewPost();
  };

  getUser = async chat => {
    const res = await fetch(`http://127.0.0.1:5000/api/all/chats/${chat}`);
    const { messages } = await res.json();

    this.setState({
      messages: messages,
      loading: false,
      uid: localStorage.getItem('uid')
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

  getMessages = event => {
    const { messages, uid } = this.state;

    let sent = [];
    let gotten = [];
    let allMgs = [];

    Object.entries(messages).forEach(([key, val]) => {
      allMgs.push(val);

      if (val.sender === uid) {
        sent.push(val);
        // console.log(sent);

        this.setState({
          sent
        });
      } else {
        gotten.push(val);

        this.setState({
          gotten
        });
      }
    });

    // sorting the messages we got
    allMgs.sort(this.dynamicSort('time'));

    console.log(allMgs);
    allMgs.forEach(element => {
      console.log(this.timeConverter(element.time), element.msg);
    });

    this.setState({
      allMessages: allMgs
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

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
    const { classes, match } = this.props;
    const { messages, uid, loading, sent, gotten, allMessages } = this.state;

    // console.log(uid);

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
            {/* <button onClick={this.getMessages}>get messages</button> */}

            <ul>{messagesT}</ul>

            <form onSubmit={this.handleMessage}>
              <input
                name="inputMessage"
                onChange={this.handleChange}
                type="text"
                value={this.state.inputMessage}
              />
              <input type="button" value="send" />
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
