import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';

import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const cdnUrl = 'https://cdn.charlesqian.workers.dev/';

const styles = theme => ({

  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  image: {
    
  }
});

class AlbumPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      open: false,
      dialogImagePath: ''
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {

    fetch(`/api/images/recent`)
    .then(async res => {
      const data = await res.json();

      if(res.status !== 200) {
        console.log(res.status);
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      this.setState({images: data})
    })
    .catch(error => {
      console.error(error);
    })
  }

  handleOpen(image) {
    this.setState({open: true, dialogImagePath: image.path});
  }

  handleClose() {
    this.setState({open: false});
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline/>
        <main>
          <Container className={classes.cardGrid} maxWidth="lg">
            <Grid container spacing={4}>
              {this.state.images.map((image) => (
                <Grid item key={image} xs={12} sm={6} >
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={cdnUrl + image.path}
                      title="Image title"
                    />
                    <CardActions>
                      <Button size="small" color="primary" onClick={() => this.handleOpen(image)}>
                        View
                      </Button>
                      <Button size="small" color="primary">
                        Like
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
                <Dialog
                  open={this.state.open}
                  onClose={this.handleClose}
                  fullWidth={true}
                  style={{maxWidth: '100%', maxHeight: '100%'}}
                > 
                  <DialogContent>
                    <img src={cdnUrl + this.state.dialogImagePath} style={{width: '100%', height: '100%'}}/>
                  </DialogContent>
                </Dialog>
            </Grid>
          </Container>
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AlbumPage);