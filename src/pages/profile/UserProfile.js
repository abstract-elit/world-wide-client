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
import Avatar from '@material-ui/core/Avatar';

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

class UserProfile extends Component {
  state = {
    user: {},
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
    const curId = this.props.match.params.userId;
    let user = firebase.auth().currentUser;

    let chat = '';

    if (curId < user.uid) {
      chat = `${curId}_${user.uid}`;
    } else {
      chat = `${user.uid}_${curId}`;
    }

    // sending the user to the chat
    this.props.history.push(`/messages/chat/${chat}`);
  };

  render() {
    const { classes, match } = this.props;
    const { name, username, photoURL } = this.state.user;

    return (
      <Paper className={classes.root} elevation={1}>
        {this.state.loading ? (
          <p>loading</p>
        ) : (
          <div>
            <Avatar alt="" src={photoURL} className={classes.avatar} />
            <Typography variant="h5" component="h3">
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
