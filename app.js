require('dotenv').config(); //el package dotenv es importado aquí. 
                            // El archivo .env es leído por el dotenv

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express(); //app es una instancia del objeto express (tiene todos sus metodos y atributos...)


app.set('view engine', 'hbs'); //cuando llamo app.set, estoy llamando un metodo de todos los metodos disponibles en el objeto express. SET es solo uno de los muchos metodos.
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //va a busar el id secreto en el archivo .env
    clientSecret: process.env.CLIENT_SECRET //va a busar el secret en el archivo .env
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])//si las credenciales están ok, tienes acceso
    console.log("Credentials ok")
  }) 
  .catch(error => console.log('Something went wrong when retrieving an access token', error)); //si no están ok, error.
  
// Our routes go here:
app.get('/', (req, res, next) => { //a basic index route that renders a homepage with a form
    res.render('index'); //cuando yo como cliente pongo "http://localhost:3000/", esto se ejecuta --> se renderiza lo que sea que esté en el index.hbs. 
  });

app.get("/artist-search", (req, res, next) => {
  //cuando alguien busca un artista en el formulario, se activa esta query
  console.log(`${req.query.artist} is the band I was looking for`); //el texto que quieres buscar está en res.query.artist
  //res.send(req.query);

  spotifyApi
    .searchArtists(req.query.artist) //this has to be inside the ""app.get("/artist-search""" scope! si no req sale como undefined.
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.send(data.body); // pongo esto aqui para saber que es lo que me trae la query
      //res.render('artist-search-results');

      

    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
