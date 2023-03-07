const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "Debe unirse a un canal de voz antes de usar este comando!"
    );
  let queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: No hay canciones reproduciéndose en este servidor.")
        .setColor("RED")
    );
  queue.connection.dispatcher.end('Omitido');
  return message.channel.send(
    new MessageEmbed()
      .setDescription("**Salté la música :white_check_mark: **")
      .setColor("BLUE")
  );
};
