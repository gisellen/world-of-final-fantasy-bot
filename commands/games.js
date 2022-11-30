const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    AttachmentBuilder,
  } = require("discord.js");
  const { request } = require("undici");
  const buttonPages = require('../utilities/pagination')

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("games")
      .setDescription("Gets info about final fantasy games"),
    async execute(interaction) {
      //get data
      const { statusCode, body } = await request(
        `https://www.moogleapi.com/api/v1/games`
      );
      const data = JSON.parse(await body.text());
      const max = data.length-1;
      const embed = []
      for(let i = 0; i < max; i++){
        let text = data[i].description.split('.').slice(0,3)
        text=text.join(". ") + "..."

        embed.push(new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(data[i].title)
          .setImage(data[i].picture)
          .setDescription(text)
          .addFields(
          { name: "Platform", value: data[i].platform },
          { name: "Release Date", value: data[i].releaseDate },
        )
        )
      }

      buttonPages(interaction, embed)
    },
  };