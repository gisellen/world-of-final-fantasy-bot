const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { request } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Gets info about a final fantasy character")
    .addStringOption(option => 
      option.setName("name").setDescription("character name").setRequired(false)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const query = new URLSearchParams({ name });
    const { statusCode, body } = await request(
      `https://www.moogleapi.com/api/v1/characters/search?${query}`
    );
    const data = JSON.parse(await body.text());
    const file = new AttachmentBuilder(data[0].pictures[0].url);

    const embed = new EmbedBuilder()
      .setColor(0xe06666)
      .setTitle(data[0].name)
      .setThumbnail(`attachment://${data[0].pictures[0].id}.jpg`)
      .addFields(
        { name: "Age", value: data[0].age },
        { name: "Job", value: data[0].job },
        { name: "Description", value: data[0].description }
      )
      .setFooter({ text: data[0].origin });
    await interaction.reply({ embeds: [embed], files: [file] });
  },
};
