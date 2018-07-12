# liri-node-app
LIRI - Language Interpreter and Recognition Interface

## USAGE
USAGE: node liri.js \<command\><br>
  \<command\> is one of the following:<br>
   my-tweets {\<screen name\>}<br>
      screen name is optional, default is 'plato_philo'<br>
      example: my-tweets 'readDonaldTrump'<br>
    spotify-this-song {\<'song name'\>}<br>
      song name is optional, default is 'The Sign'<br>
      example: spotify-this-song 'Crazy Train'<br>
    movie-this {\<movie\>}<br>
      movie is optional, default is 'Mr. Nobody'<br>
      example: movie-this 'The Bridge on the River Kwai'<br>
    do-what-it-says {\<file\>}<br>
      runs the commands in \<file\><br>
      file is optional, default is 'random.txt'<br>
      example: do-what-it-says random.txt<br>

## .env 
You must create a .env file with the following credentials

### Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

### Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

### omdb API key
OMDBAPI_KEY=your_api_key    