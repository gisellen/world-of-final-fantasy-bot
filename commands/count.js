const {SlashCommandBuilder, SlashCommandAssertions} = require("discord.js")
const { request } = require("undici");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("count")
    .setDescription("get current count of all final fantasy characters"),
    async execute(interaction){
        const { body } = await request('https://www.moogleapi.com/api/v1/characters/count')
        const data = JSON.parse(await body.text())
        interaction.reply(`There are currently ${data} characters in the Final Fantasy realm, kupo!`)
    }
}