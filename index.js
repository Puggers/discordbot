const botconfig = require("./botconfig.json");
const token = require("./token.json");
const Discord = require("discord.js");
const mysql = require("mysql");

const bot = new Discord.Client({disableEveryone: true})
const prefix = botconfig.prefix;

bot.on("ready", async()=>{

console.log(`${bot.user.username} is online!`);
bot.user.setActivity("D&D 5E")
});

bot.on('message', async message => {



    const args = message.content.slice(prefix.length).split(/ */)
    const cmd = args.shift().toLowerCase();

        console.log(`command: ${cmd}\nArgs: ${args}`)

    if(cmd === `${prefix}getinfo`){
        let botembed = new Discord.RichEmbed()
        .setDescription("Justin is god, bow to him")
        .setColor("#15f153")
        .addField("Bot Name", bot.user.username);

        return message.channel.send(botembed);
    }
});

bot.login(token.token);
