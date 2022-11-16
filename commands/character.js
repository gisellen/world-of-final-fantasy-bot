//https://www.moogleapi.com/api/v1/characters/search?name=lightning
// this code is a test run that searches for one character
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require("discord.js");
const { request } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Gets Lightning info."),
  async execute(interaction) {
    const { body } = await request(
      "https://www.moogleapi.com/api/v1/characters/search?name=lightning"
    );
    const data = JSON.parse(await body.text());
    // console.log("data", await data[0].pictures);
    const file = new AttachmentBuilder(data[0].pictures[0].url);
    console.log(await file)
    const embed = new EmbedBuilder()
      .setColor(0xe06666)
      .setTitle(data[0].name)
      .setThumbnail(`attachment://${data[0].pictures[0].id}.jpg`)
      .addFields(
        {name: "Age", value: data[0].age},
        {name: "Job", value: data[0].job},
        {name: "Description", value: data[0].description}
      )
      .setFooter({text: data[0].origin})
    await interaction.reply({ embeds: [embed], files: [file] });
  },
};
