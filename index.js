require('dotenv').config();
const Discord = require('discord.js')
//import Sequelize, { Model as _Model, TEXT, TINYINT } from 'sequelize';
const Sequelize = require('sequelize');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const dbUser = process.env.USER;
const dbPass = process.env.PASS;
const dbName = process.env.DBNAME;
const dbHost = process.env.HOST

//establish db connection
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql'
});

//test db connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//define movie model
const Model = Sequelize.Model;
class Movie extends Model { }
Movie.init({
  // attributes
  name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  played: {
    type: Sequelize.TINYINT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'movie'
  // options
});

//log in to discord
bot.login(TOKEN);

//confirm bot is loaded
bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {

  //Look for suggest prefix
  if (msg.content.startsWith('!suggest')) {

    //remove prefix from message to isolate movie name
    let name = msg.content.replace('!suggest ', '');

    //create db entry
    Movie.create({ name: name, played: 0 });

    //alert user that suggestion has been added to list
    msg.channel.send(name + ' has been added to the suggestion list.');

  }

  //look for list prefix
  if (msg.content.startsWith('!list')) {

    //gather movie list and then format list.
    list_callback().then(function (result) {

      let messagestring = '```'
let messageArray = [];
      console.log(result[0].id);
      for (i = 0; i < result.length; i++){


        messageArray[i] = result[i].id + '. ' + result[i].name;

        
      }

      //display list     

      messagestring = '```Movie List \n\n'+messageArray.join('\n')+'```';
      msg.channel.send(messagestring);
    })
  }
  if (msg.content.startsWith('!remove')) {

    let id = msg.content.replace('!remove ', '');

    const movieToRemove = remove_callback(id).then(function (result) {

      msg.channel.send('Removed!');
    });

  }

  if (msg.content.startsWith('!newpoll')) {

    var names = [];
    const thisWeeksMovies = poll_callback().then(function (result) {


      bot.channels.get(`699741363436257310`).send('/poll "Movie Poll" ' +'"'+result[0].name+'"'+'"'+result[1].name+'"'+'"'+result[2].name+'"'+'"'+result[3].name+'"')
    });

  }

});

function get_all_movies() {

  return new Promise(function (resolve, reject) {
    resolve(Movie.findAll({

      where: {
        played: 0
      }
    }));
  }

  )
};

function get_movie_by_pk(id) {

  return new Promise(function (resolve, reject) {
    resolve(Movie.findByPk(id).then(function (result) {
      if (result) {
        result.update({
          played: 1
        })
      }
    }));
  })
};

async function list_callback() {
  let getmovies = await get_all_movies();

  return getmovies;
}
async function remove_callback(id) {

  let movie_to_remove = await get_movie_by_pk(id);

  return movie_to_remove;
}

function create_poll() {

  return new Promise(function (resolve, reject) {
    resolve(Movie.findAll({
      where: {
        played:0
      },
    
      order: sequelize.random(),
      limit: 4
    }))
  });
}
async function poll_callback() {
  let getpoll = await create_poll();

  return getpoll;
}