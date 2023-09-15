#! /usr/bin/env node

console.log(
    'This script populates some test consoles, games and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Console = require("./models/console");
  const Game = require("./models/game");
  const Genre = require("./models/genre");
  
  const genres = [];
  const consoles = [];
  const games = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createConsoles();
    await createGames();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function genreCreate(index, name) {
    const genre = new Genre({ name: name });
    await genre.save();
    genres[index] = genre;
    console.log(`Added genre: ${name}`);
  }
  
  async function consoleCreate(index, title, description, stock) {
    const consoledetail = { title: title, description: description, stock: stock, };
    // const game = new Game({})
  
    const system = new Console(consoledetail);
  
    await system.save();
    consoles[index] = system;
    console.log(`Added console: ${title}`);
  }
  
  async function gameCreate(index, title, description, stock, system, genre) {
    const gamedetail = {
      title: title,
      description: description,
      stock: stock,
      genre: genre,
      system: system,
    };
    // if (genre != false) gamedetail.genre = genre;
  
    const game = new Game(gamedetail);
    await game.save();
    games[index] = game;
    console.log(`Added game: ${title}`);
  }
  
  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate(0, "Fantasy"),
      genreCreate(1, "Action Adventure"),
      genreCreate(2, "RPG"),
    ]);
  }
  
  async function createConsoles() {
    console.log("Adding consoles");
    await Promise.all([
      consoleCreate(0, "Gamecube", "Nintendo system that came out in 2001", 2),
      consoleCreate(1, "Xbox", "Microsoft system that came out in 2001", 3),
      consoleCreate(2, "Playstation 2", "Sony system that came out in 2000", 2),
      consoleCreate(3, "Gameboy Color", "Nintendo handheld system that came out in 1998", 5),
      consoleCreate(4, "Dreamcast", "Sega system that came out in 1998", 1),
    ]);
  }
  
  async function createGames() {
    console.log("Adding Games");
    await Promise.all([
      gameCreate(0,
        "Halo 2",
        "Halo 2 is the second installment in the Halo franchise and the sequel to 2001's critically acclaimed Halo: Combat Evolved. The game features new weapons, enemies, and vehicles, another player character, and shipped with online multiplayer via Microsoft's Xbox Live service.",
        1,
        consoles[1],
        genres[1]
      ),
      gameCreate(1,
        "Final Fantasy X",
        "FINAL FANTASY X tells the story of a star blitzball player, Tidus, who journeys with a young and beautiful summoner named Yuna on her quest to save the world of Spira from an endless cycle of destruction wrought by the colossal menace Sin.",
        2,
        consoles[2],
        genres[2]
      ),
      gameCreate(2,
        "The Legend of Zelda: The Windwaker",
        "The Wind Waker is a magical conductor's baton that is given to Link by the King of Red Lions when he reaches Dragon Roost Island. Long ago, it was used by the King of Hyrule to conduct the Sages when they played their song to call upon the gods.",
        5,
        consoles[0],
        genres[2]
      ),
      gameCreate(3,
        "Phantasy Star Online",
        "Phantasy Star Online is an action role-playing game primarily played with other players cooperatively over the internet. Players take on the role of adventurers sent to explore Ragol, an uncharted planet.",
        2,
        consoles[4],
        genres[0]
      ),
      gameCreate(4,
        "Pokemon Gold",
        "Unlike earlier games, Pokémon Gold and Silver take place in the Johto region, west of the region that the original games take place in, Kanto. However, Kanto can be traveled to later in the games.",
        1,
        consoles[3],
        genres[2]
      ),
    ]);
  }