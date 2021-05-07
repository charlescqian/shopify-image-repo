import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

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
                    <Copyright />
                </footer>
            </div>
        );
    }
}

export default withStyles(styles)(Footer);