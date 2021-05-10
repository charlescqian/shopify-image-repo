import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { setCookie, checkCookies } from './CookieHandlers';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const cdnUrl = 'https://cdn.charlesqian.workers.dev/';

const styles = theme => ({

  cardGrid: {
    paddingTop: theme.spacing(4),
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
});

class AlbumPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      open: false,
      dialogImagePath: '',
      likes: []
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.fetchRecentImages = this.fetchRecentImages.bind(this);
    this.fetchMostLikedImages = this.fetchMostLikedImages.bind(this);
  }

  fetchRecentImages() {
    fetch(`/api/images/recent`)
    .then(async res => {
      const data = await res.json();

      if(res.status !== 200) {
        console.log(res.status);
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      let likes = data.map(function(x) { return x.likes });
      this.setState({images: data, likes: likes})
    })
    .catch(error => {
      console.error(error);
    })
  }

  fetchMostLikedImages() {
    fetch(`/api/images/mostliked`)
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

  componentDidMount() {
    this.fetchRecentImages();
  }

  handleOpen(image) {
    this.setState({open: true, dialogImagePath: image.path});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleLike(image) {

    // Checks if the cookie is set
    if (checkCookies()) {
      // If it is set, then don't increment like count and show an alert saying the user
      // can like 1 photo every hour
      window.alert('Only one LIKE is allowed per hour.');
    } else {
      // If it is not set, set it and increase like count by 1
      setCookie();
      
      // Send a post request to update 
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({path: image.path}),
      }
  
      fetch(`/api/like`, requestOptions)
      .then(async res => {
        const data = await res.json();

        if(res.status >= 400) {
          console.log(res.status);
          // TODO: Error handling
          const error = (data && data.message) || res.statusText;
          return Promise.reject(error);
        }
        
        this.incrementLikes(image);
      })
      .catch(error => {
        console.error(error);
      })

    }

  }

  incrementLikes(image) {
    let idx = this.state.images.findIndex(x => x.path === image.path)
    console.log(idx);
    let imgs = this.state.images;
    let img = imgs[idx];
    img.likes += 1;
    imgs[idx] = img;
    this.setState({images: imgs});
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline/>
        <main>  
          
          <Container className={classes.cardGrid} maxWidth="lg">
            <div style={{justifyContent: 'center', padding:'0em 2em 1em 0.5em'}}>
                <ButtonGroup variant="contained" color="primary">
                  <Button onClick={this.fetchRecentImages}>
                    Recent
                  </Button>
                  <Button onClick={this.fetchMostLikedImages}>
                    Most Liked
                  </Button>
                </ButtonGroup>
            </div>
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
                      <IconButton onClick={() => this.handleLike(image)}>
                        <FavoriteIcon color="secondary"/>
                      </IconButton>
                      <div>
                        {image.likes}
                      </div>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {/* TODO: Use Media Queries or something to make the Dialog maxWidth responsive */}
                <Dialog
                  open={this.state.open}
                  onClose={this.handleClose}
                  fullWidth={false}
                  maxWidth='sm'
                  style={{maxWidth: '100%', maxHeight: '100%'}}
                > 
                  <DialogContent>
                    <img src={cdnUrl + this.state.dialogImagePath} style={{width: '100%', height: '100%'}} alt={this.state.dialogImagePath}/>
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