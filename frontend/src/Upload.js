import React, { Component } from 'react';
import {DropzoneDialog} from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    }
})

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: []
        };
    }
 
    handleClose() {
        this.setState({
            open: false
        });
    }
 
    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        console.log(files);
        this.setState({
            files: files,
            open: false
        });
        
        let data = new FormData();
        for (let i = 0; i < files.length; i++ ) {
            data.append("images", files[i])
        }

        const requestOptions = {
            method: 'POST',
            body: data,
        }
        console.log(requestOptions);
        
        fetch('/api/upload', requestOptions)
        .then(async res => {
            if (res.status !== 200) {
                const data = await res.json();

                console.log(res.status);
                const error = (data && data.message) || res.status;
                console.log(error);
            }
        })
        .catch(error => {
            console.error(error);
        })
    }
 
    handleOpen() {
        this.setState({
            open: true,
        });
    }
 
    render() {
        const { classes } = this.props;
        const inputProps = {
            name: "images"
        };
        return (
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Shopify Image Repo Challenge
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        This is Charles Qian's submission to the Shopify Developer Intern Challenge. This application is built on the MERN stack.
                        The images are stored on GCP and a Cloudflare Worker is used as a CDN to serve the images.
                        Click on the button below to upload an image, then click on "Recent" to load the image.
                    </Typography>
                    <div className={classes.heroButtons}>
                        <Grid container spacing={2} justify="center">
                            <Grid item>
                                <Button variant="contained" color="primary" 
                                onClick={this.handleOpen.bind(this)}>
                                Add Image
                                </Button>
                                <DropzoneDialog
                                    open={this.state.open}
                                    onSave={this.handleSave.bind(this)}
                                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                                    showPreviews={true}
                                    maxFileSize={10*1024*1024}
                                    onClose={this.handleClose.bind(this)}
                                    filesLimit={10}
                                    inputProps={inputProps}
                                    maxWidth='md'
                                />
                            </Grid>
                        </Grid>
                    </div>
                    </Container>
                </div>
            </main>
        );
    }
}

export default withStyles(styles)(Upload);