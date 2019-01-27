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
  }
});

class Home extends Component {
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

    // const getUser = async () => {
    //   const res = await fetch('http://127.0.0.1:5000/api/all');
    //   const { users } = await res.json();

    //   console.log(users);

    //   // this.setState({
    //   //   users: data.users,
    //   //   loading: false
    //   // });
    // };

    // console.log('hello');

    // getUser();
  }

  deleteUser = () => {
    // const userID = e.target.getAttribute('userid');
    // const userRef = dbRef.child('users/' + userID);
    // userRef.remove();
  };

  handleUserClick = user => {
    console.log(user);
    // console.log('hello');
    this.props.history.push(`/profile/${user.userId}`);
  };

  render() {
    const { classes } = this.props;
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
            <Typography component="p">
              I love talking about football!
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Message
          </Button>
          {/* <Button size="small" color="primary">
            Visit profile
          </Button> */}
        </CardActions>
      </Card>
    ));

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          All Users:
        </Typography>

        <div className={classes.allUsers}>
          {this.state.loading ? <p>loading</p> : renderU}
        </div>
      </Paper>
    );
  }
}

const withRoutes = withRouter(Home);
export default withStyles(styles)(withRoutes);
