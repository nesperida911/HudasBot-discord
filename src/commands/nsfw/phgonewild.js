const { RedditSimple } = require("reddit-simple");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, [args, time], level) => { // eslint-disable-line no-unused-vars
    var warningEmbed = new MessageEmbed();
    warningEmbed.setColor('#d9534f');
    var timed;

    if (!message.channel.nsfw) {
        warningEmbed.setDescription(`**This command can only be used in channels marked nsfw.**`);
        return message.channel.send(warningEmbed);
    } else {
        if (args === "timed" && message.guild.ownerID === message.author.id) {
            warningEmbed.setDescription(`**Timed post has been activated. New random post from /r/phgonewild every ${time} minute(s).**`);
            warningEmbed.setColor('#5cb85c');
            message.channel.send(warningEmbed);

            timed = setInterval(() => {
                client.logger.log("[PHGONEWILD] Sent a timed message");
                RedditSimple.RandomPost("phgonewild").then(async res => {
                    var string = await JSON.stringify(res);
                    var reddit = await JSON.parse(string);

                    var subreddit = reddit[0].data.subreddit;
                    var title = reddit[0].data.title;
                    var author = reddit[0].data.author;
                    var permalink = reddit[0].data.permalink;
                    var url = reddit[0].data.url;

                    var nsfwEmbed = {
                        color: 0xff5700,
                        author: {
                            name: `r/${subreddit}`,
                            icon_url: 'https://styles.redditmedia.com/t5_2tf96/styles/communityIcon_s9l1zwzkxz741.jpg',
                            url: `https://www.reddit.com/${subreddit}`,
                        },
                        title: `${author} says "${title}"`,
                        url: `https://www.reddit.com${permalink}`,
                        image: {
                            url: url,
                        },
                    };

                    message.channel.startTyping();
                    message.channel.send({
                        embed: nsfwEmbed
                    }).catch(console.error);
                    message.channel.stopTyping();
                }).catch(e => {
                    console.log(e);
                });
            }, time * 60000);
        } else if (args === "timed") {
            warningEmbed.setDescription(`**Only server admin can set this timed message.**`);
            message.channel.send(warningEmbed);
        } else if (args === "cancel" && message.guild.ownerID === message.author.id) {
            warningEmbed.setDescription(`**Timed random post has been cancelled.**`);
            message.channel.send(warningEmbed);
            clearInterval(timed);
        } else {
            RedditSimple.RandomPost("phgonewild").then(async res => {
                var string = await JSON.stringify(res);
                var reddit = await JSON.parse(string);

                var subreddit = reddit[0].data.subreddit;
                var title = reddit[0].data.title;
                var author = reddit[0].data.author;
                var permalink = reddit[0].data.permalink;
                var url = reddit[0].data.url;

                var nsfwEmbed = {
                    color: 0xff5700,
                    author: {
                        name: `r/${subreddit}`,
                        icon_url: 'https://styles.redditmedia.com/t5_2tf96/styles/communityIcon_s9l1zwzkxz741.jpg',
                        url: `https://www.reddit.com/${subreddit}`,
                    },
                    title: `${author} says "${title}"`,
                    url: `https://www.reddit.com${permalink}`,
                    image: {
                        url: url,
                    },
                };

                message.channel.startTyping();
                message.channel.send({
                    embed: nsfwEmbed
                }).catch(console.error);
                message.channel.stopTyping();
            }).catch(e => {
                console.log(e);
            });
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "NSFW"
};

exports.help = {
    name: "phgonewild",
    category: "NSFW",
    description: "Send a random image from r/phgonewild",
    usage: "h!phgonewild\nServer admin can set a timer to make bot send a scheduled message every minute\nFor Server Admin\nh!phgonewild timed <minutes>"
};