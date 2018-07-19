const OUTPUT_FILE = "log.txt";
const DEFAULT_INPUT_FILE = "random.txt";
const DEFAULT_SONG = "The Sign";
const DEFAULT_SCREEN_NAME = "plato_philo";
const DEFAULT_MOVIE = "Mr. Nobody";
const fs = require('fs');

// This is so I can test without calling API
// (Since they tend to limit calls per day, etc)
const SAVE_TEST_OUTPUT = false;
const TEST_WO_API = false;

// import keys
require("dotenv").config();
const keys = require("./keys");

// ==================
// LIRI Bot prototype
// ==================
function LiriBot() {

  // Process a command
  this.processCommand = function(cmd, param1) {
    cmd = cmd.trim(); // In case there is exta whitespace
    param1 = param1 ? param1.trim() : undefined;
    switch(cmd.toLowerCase()) {
      case 'my-tweets':
        this.getTweets(param1);
        break;
      
      case 'spotify-this-song':
        this.spotifyThisSong(param1);
        break;

      case 'movie-this':
        this.movieThis(param1);
        break;

      case 'do-what-it-says':
        this.processFile(param1);
        break;

      default:
        console.log("UNKNOWN command: " + cmd);
    }
  };

  // ===========
  // = Twitter =
  // ===========
  this.getTweets = function(screenName) {
    // Get last 20 tweets, along with when they were created
    if (screenName === undefined) 
        screenName = DEFAULT_SCREEN_NAME;
    screenName = screenName.replace(/["']/g, "");

    let Twitter = require('twitter');
    let client = new Twitter({
      consumer_key: keys.twitter.consumer_key,
      consumer_secret: keys.twitter.consumer_secret,
      access_token_key: keys.twitter.access_token_key,
      access_token_secret: keys.twitter.access_token_secret
    });

    // statuses/user_timeline.json?screen_name=twitterapi&count=2
    let requestDir = 'statuses/user_timeline';
    let params = {screen_name: screenName, count: 20};
    client.get(requestDir, params, (error, tweets, response) => {
      if (error) {
        return console.log(error);
      }
      this.processTweets(tweets, screenName);
    });
  };

  this.processTweets = function(tweets, screenName) {
    // moment is used to reformat time to local time
    moment = require('moment');
    let dFormat = 'ddd MMM D HH:mm:ss Z YYYY';

    let outArr = tweets.map((tweet) => {
      return { name        : tweet.user.name,
               screen_name : tweet.user.screen_name,
               created_at  : moment(tweet.created_at, dFormat).format(dFormat),
               text        : tweet.text,
             }});

    let output = "\n\nmy-tweets '" + screenName + "'\n\n";
    for (let i = 0; i < outArr.length; i++) {
      output += "  " + outArr[i].name + "  @" + outArr[i].screen_name + "  " + outArr[i].created_at + "\n";
      output += "" + outArr[i].text + "\n\n";
    }
    this.output(output);
  };

  // ===========
  // = Spotify =
  // ===========
  this.spotifyThisSong = function(song) {
    // From Spotify get the following for song:
    //   - Artist
    //   - Song's name
    //   - Preview link
    //   - Album song is from
    // Default song is 'The Sign' by Ace of Base (I have no idea why)
    //
    if (song === undefined)
      song = DEFAULT_SONG;
    song = song.replace(/["']/g, "");

    if (TEST_WO_API) {
      // TESTING
      let file = 'test-spotify.out';
      console.log("Reading test file " + file);
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          return console.log(err);
        }
        this.processSpotifyOutput(data, song);
      });
      return;
    }

    // connect to Spotify
    const Spotify = require('node-spotify-api');
    const spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret,
    });

    // Call the API (through the node module)
    spotify.search({ type: 'track', query: song }, (err, data) => {
      if (err) {
        return console.log('Spotify Error: ' + err);
      }
      if (SAVE_TEST_OUTPUT) {
        let file = 'test-spotify.out';
        fs.writeFile(file, JSON.stringify(data), (err) => {
          if (err)
            return console.log(err);
        });
      }
      else {
        this.processSpotifyOutput(data, song);
      }
    });
  };
  this.processSpotifyOutput = function(data, song) {
    // this.testSpotifyOutput(data);
 
    // For our purposes, we'll just use the 1st album
    let album = data.tracks.items[0];

    // Get the artists
    let names = [];
    for (let j = 0; j < album.artists.length; j++) {
      names.push(album.artists[j].name);
    }


    let qstr = (song.charAt(0) === '"' || song.charAt(0) === "'") ? "" : "'";
    let output = "\n\nspotify-this-song " + qstr + song + qstr + "\n" +
    "  Artist     : " + names.join(',') + '\n' +
    "  Song Name  : " + album.name + '\n' +
    "  Preview URL: " + album.preview_url + '\n' +
    "  Album Name : " + album.album.name + '\n\n';
    this.output(output);
  };
  this.testSpotifyOutput = function(data) {
    console.log("testSpotifyOutput: parsing data");
    data = JSON.parse(data);
    // How many keys are at top level:
    for (let prop in data) {
      console.log("Key: [" + prop + "] value type: " + typeof(data[prop]));
    }
    for (let prop in data.tracks) {
      console.log("  Key: [" + prop + "] value type: " + typeof(data.tracks[prop]));
      if (prop === 'items') {
        console.log("    items.length: " + data.tracks.items.length);
      }
    }
    console.log("");
    console.log("=== items ===");
    let items = data.tracks.items;
    let end = items.length;
    for (let i = 0; i < end; i++) {
      console.log("item " + i);
      for (let prop in items[i]) {
        if (items[i].album.album_type !== 'album')
          continue;
        // console.log("  Key: [" + prop + "] value type: " + typeof(items[i][prop]));
        if (prop === 'album') {
          console.log("    album.album_type: " + items[i].album.album_type);
          console.log("    album.name      : " + items[i].album.name);
        } else if (prop === 'name') {
          console.log("    name            : " + items[i].name);
        } else if (prop === 'artists') {
          let names = [];
          for (let j = 0; j < items[i].artists.length; j++) {
            names.push(items[i].artists[j].name);
          }
          console.log("    artists         : " + names.join(','));
        } else if (prop === 'preview_url') {
          console.log("    preview_url     : " + items[i].preview_url);
        }
      }
    }
  }

  // ===========
  // = omdbAPI =
  // ===========
  this.movieThis = function(movie) {
    // Get info from omdAPI
    //  * Title of the movie.
    //  * Year the movie came out.
    //  * IMDB Rating of the movie.
    //  * Rotten Tomatoes Rating of the movie.
    //  * Country where the movie was produced.
    //  * Language of the movie.
    //  * Plot of the movie.
    //  * Actors in the movie.
    if (movie === undefined)
      movie = DEFAULT_MOVIE;
    movie = movie.replace(/["']/g, "");

    if (TEST_WO_API) {
      // TESTING
      let file = 'test-movie.out';
      console.log("Reading test file " + file);
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          return console.log(err);
        }
        this.processMovie(JSON.parse(data), movie);
      })
      return;
    }
    let request = require('request');
    let api_key = keys.omdbapi.key;
    let queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + api_key;

    request(queryURL, (err, response, body) => {
      if (err) {
        return console.log(err);
      }
      if (response.statusCode === 200) {
        this.processMovie(JSON.parse(body), movie);
      }
    });
  };
  this.processMovie = function(data, movie) {
    if (SAVE_TEST_OUTPUT) {
      fs.writeFile("test-movie.out", data, (err) => {
        if (err)
          console.log(err);
      });
      return;
    }
    // console.log(data);
    let output = "";
    if (data.Error) {
        output = data.Error;
    } else {
      let imdbRating = "";
      let rtRating = "";
      for (let i = 0; i < data.Ratings.length; i++) {
        if (data.Ratings[i].Source === 'Internet Movie Database')
          imdbRating = data.Ratings[i].Value;
        if (data.Ratings[i].Source === 'Rotten Tomatoes')
          rtRating = data.Ratings[i].Value;
      }

      output = "\n\nmovie-this '" + movie + "'\n" +
      "  Title           : " + data.Title + '\n' +
      "  Year            : " + data.Year + '\n' +
      "  IMDB Rating     : " + imdbRating + '\n' +
      "  Rotten Tomatoes : " + rtRating + '\n' +
      "  Country         : " + data.Country + '\n' +
      "  Language        : " + data.Language + '\n' +
      "  Plot            : " + data.Plot + '\n' +
      "  Actors          : " + data.Actors + '\n\n';
    }

    this.output(output);
  };

  // ===============
  // = processFile =
  // ===============
  this.processFile = function(file) {
    // Read and process the command on each line of the file
    // Default file is 'random.txt'
    // Commands are in the form:
    //   command,parameter
    // Example:
    //   spotify-this-song,"I Want it That Way"
    if (file === undefined) 
      file = DEFAULT_INPUT_FILE;
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        this.output(err);
        return;
      }
      lineArray = data.split('\n');
      for (let i = 0; i < lineArray.length; i++) {
        cmdArray = lineArray[i].split(',');
        this.processCommand(cmdArray[0], cmdArray[1]);
      }
    });
  };

  // ===========
  // = output ==
  // ===========
  this.output = function(msg) {
    // Output to command line
    // Append to output file
    console.log(msg);

    // FIXME - add OUTPUT_FILE here (not now, it'll just be a pain)
    fs.appendFile(OUTPUT_FILE, msg, function(err) {
      if (err)
        console.log(err);
    });
  }
}


let liri = new LiriBot();

if (process.argv.length < 3) {
  console.log("Ummm... I need at least one parameter to tell me what to do");
  console.log("");
  console.log("USAGE: node liri.js <command>")
  console.log("  <command> is one of the following:");
  console.log("    my-tweets {<screen name>}");
  console.log("      screen name is optional, default is 'plato_philo'");
  console.log("      example: my-tweets 'readDonaldTrump'");
  console.log("    spotify-this-song {<'song name'>}");
  console.log("      song name is optional, default is 'The Sign'");
  console.log("      example: spotify-this-song 'Crazy Train'");
  console.log("    movie-this {<movie>}");
  console.log("      movie is optional, default is 'Mr. Nobody'");
  console.log("      example: movie-this 'The Bridge on the River Kwai'");
  console.log("    do-what-it-says {<file>}");
  console.log("      runs the commands in <file>");
  console.log("      file is optional, default is 'random.txt'");
  console.log("      example: do-what-it-says random.txt");
  return;
}

liri.processCommand(process.argv[2], process.argv[3]);

