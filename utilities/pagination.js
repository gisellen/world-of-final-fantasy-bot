const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')

async function buttonPages (interaction, pages, time = 60000) {
    if (!interaction) throw new Error("provide an interaction argument")
    if(!pages) throw new Error("provide page arguement")
    if(!Array.isArray(pages)) throw new Error("pages must be an array")

    if(typeof time !== "number") throw new Error("time must be a num")
    if(parseInt(time) < 30000) throw new Error("time must be greater than 30 secs")

    await interaction.deferReply();

    if (pages.length === 1) {
        const page = await interaction.editReply({
            embeds:pages,
            components: [],
            fetchReply: true
        })
        return page
    }

    const prev = new ButtonBuilder()
        .setCustomId('prev')
        .setStyle(ButtonStyle.Primary)
        .setLabel("prev")

    
    const next = new ButtonBuilder()
        .setCustomId('next')
        .setStyle(ButtonStyle.Primary)
        .setLabel("next")

    const buttonRow = new ActionRowBuilder().addComponents(prev, next);
    
    let index = 0
    const currentPage = await interaction.editReply({
        embeds: [pages[index]],
        components: [buttonRow],
        fetchReply: true
    })

//collector
const collector = await currentPage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time
})

collector.on("collect", async i => {
    if(i.user.id !== interaction.user.id)
        return i.reply({
            content: "u cant use those buttons",
            ephmeral: true
        })

        await i.deferUpdate()

        if(i.customId === 'prev'){
            if(index > 0) index--;
        } else if (i.customId === 'next'){
            if(index<pages.length -1) index++
        }

        if(index === 0) prev.setDisabled(true)
        else prev.setDisabled(false)

        if(index === pages.length -1) next.setDisabled(true)
        else next.setDisabled(false)

        await currentPage.edit({
            embeds:[pages[index]],
            components: [buttonRow]
        })

        collector.resetTimer()
})

collector.on("end", async i => {
    await currentPage.edit({
        embeds: [pages[index]],
        components: []
    })
})

return currentPage

} 


module.exports = buttonPages;