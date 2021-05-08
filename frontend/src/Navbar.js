import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import CameraIcon from '@material-ui/icons/Camera';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    appBar: {
        backgroundColor: "primary",
    }
})
class Navbar extends Component {
    
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="sticky" className={classes.appBar}>
                    <Toolbar>
                        <CameraIcon />
                        <Typography variant="h6" color="inherit" noWrap>
                            Shopify Intern Challenge
                        </Typography>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Navbar);