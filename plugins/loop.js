const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const queue = message.client.queue.get(message.guild.id);

  if (!queue)
    return message.channel.send(
      ":x: No hay canciones reproduciéndose en este servidor."
    );

  queue.loop = !queue.loop;
  message.channel.send(
    new MessageEmbed()
      .setAuthor(
        "Loop",
        "https://mondongo.cf/assets/img/bot/loop.gif"
      )
      .setColor("BLUE")
      .setTimestamp()
      .setDescription(
        "**el bucle esta" +
          (queue.loop == true ? " Activado " : " Desactivado ") +
        "para la canción actual :white_check_mark: **"
      )
  );
};
