# shopify-image-repo

This is my submission to the Shopify Developer Intern Challenge for Fall 2021. The app is a basic image repo, with functionality to upload images and liking the photos.

This project is built using the MERN stack. The images are stored on a public GCP bucket, and a Cloudflare Worker is used as a CDN to serve the images. The frontend React components are from [Material-UI](https://material-ui.com/).

![shopify-image-repo-ss.png](shopify-image-repo-ss.png)

## Usage

The app is deployed on Google Cloud and can be found here: https://concrete-zephyr-312801.uc.r.appspot.com/.

You can upload up to 10 pictures at a time by pressing the "Add Image" button and selecting the pictures you want to upload. After uploading, you can press the "Recent" button to see your uploaded picture.

There is also a "Like" function, where each user can "Like" a picture. The number of "Likes" a picture has is displayed beneath it. Pictures can be sorted by the number of likes in descending order. A cookie is used to set a time-out for one hour for each browser. 

Currently, only the last 20 uploaded pictures and the 20 most liked pictures can be viewed. 

## Future Features and Work

A few important features I would like to add are user authentication, so that each user can manage the pictures they upload, and searching. There also should be a lot more unit and integration tests :).