import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';
import Grid from '@material-ui/core/Grid';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    }
})

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

class Footer extends Component {
    
    render() {
        const { classes } = this.props;
        return (
            < div> 
                <footer className={classes.footer}>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Charles Qian
                    </Typography>
                    <Grid container justify="center">
                        <IconButton href="https://github.com/charlescqian/shopify-image-repo" target="_blank">
                            <GitHubIcon />
                        </IconButton>
                        <IconButton href="https://www.linkedin.com/in/charlescqian/" target="_blank">
                            <LinkedInIcon/>
                        </IconButton>
                    </Grid>
                    <Copyright />
                </footer>
            </div>
        );
    }
}

export default withStyles(styles)(Footer);