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
import { withRouter } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import { BulletList } from 'react-content-loader';

const styles = theme => ({
  root: {
    minHeight: '100vh',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: '900px',
    margin: 'auto'
  },
  card: {
    maxWidth: '200px',
    margin: '10px'
  },
  allUsers: {
    display: 'flex',
    flexWrap: 'wrap'
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
  }
});

class Home extends Component {
  state = {
    users: [],
    loading: true
  };

  componentDidMount() {
    const dbRef = firebase.database().ref();
    const usersRef = dbRef.child('users');
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

  handleUserClick = user => {
    this.props.history.push(`/profile/${user.userId}`);
  };

  render() {
    const { classes } = this.props;

    console.log(this.state.users);

    const renderU = this.state.users.map(user => (
      <Card className={classes.card}>
        <CardActionArea onClick={() => this.handleUserClick(user)}>
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            className={classes.media}
            height="200"
            image={user.photoURL}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {user.name}
            </Typography>
            <Typography component="p">{user.bio}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Message
          </Button>
        </CardActions>
      </Card>
    ));

    return (
      <div className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          All Users:
        </Typography>

        {this.state.loading ? (
          <div className={classes.loading}>
            <LinearProgress
              className={classes.progress}
              classes={{
                colorPrimary: classes.linearColorPrimary,
                barColorPrimary: classes.linearBarColorPrimary
              }}
            />

            <BulletList />
          </div>
        ) : (
          <div className={classes.allUsers}>{renderU}</div>
        )}
      </div>
    );
  }
}

const withRoutes = withRouter(Home);
export default withStyles(styles)(withRoutes);
