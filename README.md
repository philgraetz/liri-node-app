# liri-node-app
LIRI - Language Interpreter and Recognition Interface

## Dependencies
- dotenv
- twitter
- moment
- node-spotify-api
- request

Install node packages by running:
```
npm install
```
## USAGE
```
USAGE: node liri <command>
  Where <command> is one of the following:
    my-tweets {<screen name>}
      screen name is optional, default is 'plato_philo'
      example: node liri my-tweets 'readDonaldTrump'

    spotify-this-song {<song name>}
      song name is optional, default is 'The Sign'
      example: node liri spotify-this-song 'Crazy Train'

    movie-this {<movie>}
      movie is optional, default is 'Mr. Nobody'
      example: node liri movie-this 'The Bridge on the River Kwai'

    do-what-it-says {<file>}
      runs the commands in <file>
      file is optional, default is 'random.txt'
      example: node liri do-what-it-says random.txt

Output is to the console and to the file 'log.txt'
```
---
## .env 
You must create a .env file with the following:
```
# Spotify API keys
SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys
TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# omdb API key
OMDBAPI_KEY=your_api_key
```    