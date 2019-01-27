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

class UserProfile extends Component {
  state = {
    user: {},
    loading: true
  };

  componentDidMount() {
    const getUser = async id => {
      const res = await fetch(`http://127.0.0.1:5000/api/all/${id}`);
      const { user } = await res.json();

      console.log(user);

      this.setState({
        user: user,
        loading: false
      });
    };

    getUser(this.props.match.params.userId);
  }

  render() {
    const { classes, match } = this.props;

    console.log();

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          {this.state.user.name}
          <p>{this.state.user.username}</p>
        </Typography>
      </Paper>
    );
  }
}

const withRoutes = withRouter(UserProfile);
export default withStyles(styles)(withRoutes);
