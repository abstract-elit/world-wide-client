import React, { Component } from 'react';
import firebase from 'firebase';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Facebook } from 'react-content-loader';

import { convertCountryCode } from '../../config';

import Flag from 'react-world-flags';

// const MyInstagramLoader = () => <Instagram />;

const styles = theme => ({
  root: {
    minHeight: '100vh',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: '900px',
    margin: 'auto'
    // background: '#00ffba'
  },
  avatar: {
    // margin: 10,
    width: '80%',
    height: 'auto'
  },
  mainCountry: {},
  wrapper: {},
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  name: {
    textTransform: 'capitalize'
  },
  gridContainer: {
    margin: 'auto'
  },
  info: {
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  infoLanguages: {
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '20px'
  },
  linearColorPrimary: {
    backgroundColor: '#333'
  },
  linearBarColorPrimary: {
    backgroundColor: '#00ffba'
  },
  progress: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%'
  },
  loading: {
    margin: 'auto'
  }
});

const User = {
  email: 'emerson@gmail.com',
  username: 'emerson',
  photoURL: 'https://avatars0.githubusercontent.com/u/24904209?s=460&v=4',
  userId: 'ihEyfd0WnKXdonUWPNEul322KNO2',

  name: 'emerson',
  country: 'br',
  learn: 'English',
  speak: 'Portuguese',
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

    // const { name, country, learn, speak, photoURL, age } = this.state.fakeUser;

    const { name, country, learn, speak, photoURL, age } = this.state.user;

    return (
      <div className={classes.root} elevation={1}>
        {this.state.loading ? (
          // <CircularProgress className={classes.progress} />
          <div>
            <LinearProgress
              className={classes.progress}
              classes={{
                colorPrimary: classes.linearColorPrimary,
                barColorPrimary: classes.linearBarColorPrimary
              }}
            />

            <Facebook />
          </div>
        ) : (
          <div>
            <Grid className={classes.gridContainer} container spacing={24}>
              <Grid item xs={12} sm={4} md={4} className={classes.info}>
                <Avatar alt="" src={photoURL} className={classes.avatar} />
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <div className={classes.info}>
                  <Typography
                    variant="h5"
                    component="h3"
                    className={classes.name}
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="h6"
                    className={classes.age}
                  >
                    , {age} years old
                  </Typography>

                  <Typography
                    style={{ textTransform: 'capitalize' }}
                    variant="h6"
                    component="h6"
                    className={classes.age}
                  >
                    , {convertCountryCode(country)}.
                  </Typography>

                  <Flag
                    style={{ marginLeft: '10px' }}
                    code={country}
                    height="20"
                  />
                </div>

                <Typography
                  style={{ textTransform: 'capitalize' }}
                  // variant="h6"
                  component="p"
                  className={classes.infoLanguages}
                >
                  Speaks: {speak}
                  {/* <Flag
                    style={{ marginLeft: '10px' }}
                    code={speak}
                    height="20"
                  /> */}
                </Typography>
                <Typography
                  style={{ textTransform: 'capitalize' }}
                  // variant="h6"
                  component="p"
                  className={classes.infoLanguages}
                >
                  Learns: {learn}
                  {/* <Flag
                    style={{ marginLeft: '10px' }}
                    code={learn}
                    height="20"
                  /> */}
                </Typography>
              </Grid>

              <Grid item xs={12} className={classes.info}>
                <Button
                  onClick={this.handleClick}
                  variant="contained"
                  color="primary"
                  style={{ width: '50%' }}
                >
                  Message
                </Button>

                <Button
                  // onClick={this.handleClick}
                  variant="contained"
                  color="secondary"
                  style={{ width: '50%' }}
                >
                  Block
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

const withRoutes = withRouter(UserProfile);
export default withStyles(styles)(withRoutes);
