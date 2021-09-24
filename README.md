<h2 align="center"><b><a href="http://xamify-pdf-generator.vercel.app/">XAMFIY PDF GENERATOR</a></b></h2>

<h4 align="center">Node/Express based PDF Generator for the Xamify API</h4>

<br>
<hr>
<br>

## Stack

- NodeJs
- Express
- Puppeteer
- Handlebars
- Vercel Serverless Functions (Deployment)

<br>

## Description
NodeJS based serverless function to generate PDFs for the Xamify developed for the [HackNPitch](https://juesummit2021.herokuapp.com/hacknpitch) Hackathon 2021.
<br>

## Frontends

This API is consumed by our two React/Axios frontends:
- Teachers Dashboard ([GitHub](https://github.com/homeboy445/xamify-teacher))
- Student Dashboard  ([GitHub](https://github.com/homeboy445/xamify))

<br>

## Xamify REST API

PDFs are generated on request for the submissions created by students. For this the PDF is requested by the API and the data is given though a POST request.

[Xamify API GitHub Repo](https://github.com/ujjawal-shrivastava/xamify-api)
<br>

## Local Development


#### Clone the repo
``` git clone https://github.com/ujjawal-shrivastava/xamify-pdf-generator.git```

#### Change the working directory
```cd xamify-pdf-generator```

#### Install the node packages
```npm install```

#### Create a .env file and put all the required environment variables mentioned in ```.env.example```
#### Start the development server
```npm run dev```


<br>

## Routes

The ping for the API is ```/ping```

The base route for the API is ```/generate/```

<br>

## Issues?
Let us know by creating an issue!
<br>