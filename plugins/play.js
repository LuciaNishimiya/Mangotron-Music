const ytdl = require("discord-ytdl-core");
const youtubeScraper = require("yt-search");
const yt = require("ytdl-core");
const { MessageEmbed, Util } = require("discord.js");
const forHumans = require("../utils/forhumans.js");

exports.run = async (client, message, args) => {
  const channel = message.member.voice.channel;

  const error = (err) => message.channel.send(err);
  const send = (content) => message.channel.send(content);
  const setqueue = (id, obj) => message.client.queue.set(id, obj);
  const deletequeue = (id) => message.client.queue.delete(id);
  var song;

  if (!channel) return error("Debes unirte a un canal de voz para reproducir música!");

  if (!channel.permissionsFor(message.client.user).has("CONNECT"))
    return error("No tengo permiso para unirme al canal de voz.");

  if (!channel.permissionsFor(message.client.user).has("SPEAK"))
    return error("No tengo permiso para hablar en el canal de voz.");

  const query = args.join(" ");

  if (!query) return error("¡No proporcionaste un nombre de canción para reproducir!");

  if (query.includes("www.youtube.com")) {
    try {
      const ytdata = await await yt.getBasicInfo(query);
      if (!ytdata) return error("No se encontró ninguna canción para la URL proporcionada");
      song = {
        name: Util.escapeMarkdown(ytdata.videoDetails.title),
        thumbnail:
          ytdata.player_response.videoDetails.thumbnail.thumbnails[0].url,
        requested: message.author,
        videoId: ytdata.videoDetails.videoId,
        duration: forHumans(ytdata.videoDetails.lengthSeconds),
        url: ytdata.videoDetails.video_url,
        views: ytdata.videoDetails.viewCount,
      };
    } catch (e) {
      console.log(e);
      return error("Ocurrió un error, verifique la consola aaaaaaa me mueroooooo T-T");
    }
  } else {
    try {
      const fetched = await (await youtubeScraper(query)).videos;
      if (fetched.length === 0 || !fetched)
        return error("¡No pude encontrar la canción que me pediste!'");
      const data = fetched[0];
      song = {
        name: Util.escapeMarkdown(data.title),
        thumbnail: data.image,
        requested: message.author,
        videoId: data.videoId,
        duration: data.duration.toString(),
        url: data.url,
        views: data.views,
      };
    } catch (err) {
      console.log(err);
      return error("Ocurrió un error, verifique la consola aaaaaaa me mueroooooo T-T");
    }
  }

  var list = message.client.queue.get(message.guild.id);

  if (list) {
    list.queue.push(song);
    return send(
      new MessageEmbed()
        .setAuthor(
          "La canción ha sido añadida a la cola.",
          "https://mondongo.cf/assets/img/bot/logo.gif"
        )
        .setColor("F93CCA")
        .setThumbnail(song.thumbnail)
        .addField("Nombre de la cancion", song.name, false)
        .addField("vistas", song.views, false)
        .addField("Duración", song.duration, false)
        .addField("Solicitado por", song.requested.tag, false)
        .setFooter("Posicionado " + list.queue.length + " En la cola")
    );
  }

  const structure = {
    channel: message.channel,
    vc: channel,
    volume: 85,
    playing: true,
    queue: [],
    connection: null,
  };

  setqueue(message.guild.id, structure);
  structure.queue.push(song);

  try {
    const join = await channel.join();
    structure.connection = join;
    play(structure.queue[0]);
  } catch (e) {
    console.log(e);
    deletequeue(message.guild.id);
    return error("No pude unirme al canal de voz. Verifique la consola.");
  }

  async function play(track) {
    try {
      const data = message.client.queue.get(message.guild.id);
      if (!track) {
        data.channel.send("La cola está vacía, dejando el canal de voz");
        message.guild.me.voice.channel.leave();
        return deletequeue(message.guild.id);
      }
      data.connection.on("disconnect", () => deletequeue(message.guild.id));
      const source = await ytdl(track.url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        opusEncoded: true,
      });
      const player = data.connection
        .play(source, { type: "opus" })
        .on("finish", () => {
          var removed = data.queue.shift();
          if(data.loop == true){
            data.queue.push(removed)
          }
          play(data.queue[0]);
        });
      player.setVolumeLogarithmic(data.volume / 100);
      data.channel.send(
        new MessageEmbed()
          .setAuthor(
            "Reproduciendo canción",
            "https://mondongo.cf/assets/img/bot/logo.gif"
          )
          .setColor("9D5CFF")
          .setThumbnail(track.thumbnail)
          .addField("Nombre de la cancion", track.name, false)
          .addField("vistas", track.views, false)
          .addField("Duración", track.duration, false)
          .addField("Solicitado por", track.requested, false)
          .setFooter("Reproductor de música de Youtube")
      );
    } catch (e) {
      console.error(e);
    }
  }
};
