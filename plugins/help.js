const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const commands =`play <Nombre de la canción o URL>\`\` - Reproducir canciones de youtube
   pause\`\` - pausar las canciones que se están reproduciendo actualmente en el servidor
   queue\`\` - Muestra la cola de canciones del servidor
   skip\`\` - Salta a la siguiente canción en la cola
   skipto <Número objetivo>\`\` - Múltiples saltos hasta el objetivo
   stop\`\` - Detiene la canción y borra la cola
   loop\`\` - habilitar / deshabilitar el bucle para la canción que se está reproduciendo actualmente
   remove <Número de destino>\`\` - elimina una canción de la cola
   help\`\` - Para ver la lista de comandos`;

  const revised = commands
    .split("\n")
    .map((x) => "• " + "``" + client.config.prefix + x.trim())
    .join("\n");

  message.channel.send(
    new MessageEmbed()
      .setAuthor(
        "Mondongin MusicBot https://mondongo.cf/",
        "https://mondongo.cf/assets/img/bot/logo.gif"
      )
      .setColor("FFFBFB")
      .setTimestamp()
      .setDescription(revised)
  );
};
