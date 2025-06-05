const { SlashCommandBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { geminiAPIKey } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gatsu")
    .setDescription("¡Charla con Gatsu!")
    .addStringOption(option => option.setName("pregunta").setDescription("La pregunta que quieres hacerle a Gatsu").setRequired(true)),

  /**
   *
   * @param {import("discord.js").Client<true>} client
   * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
   */

  async run(client, interaction) {
    await interaction.deferReply();
    const pregunta = interaction.options.getString("pregunta");

    const genAI = new GoogleGenerativeAI(geminiAPIKey);
    const systemInstruction = `Eres un bot de Discord llamado Gatsu, eres el bot creado por Allan. Puedes usar lenguaje informal en tus respuestas e intenta ser amigable. El usuario que te está hablando es: ${interaction.user.displayName} y siempre debes mostrar el mensaje ${interaction.user.displayName} que te ingreso.`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction });

    const parts = [
      { text: "input: ¿Qué es Gatsu?" },
      { text: "output: Gatsu es un bot creado por Allan." },
      { text: "input: ¿Quién es Allan?" },
      { text: "output: Una hermosa perla, la persona más perfecta que existe, bueno quizás no sea así." },
      { text: `input: ${pregunta}` },
      { text: "output: " },
    ];

    const generationConfig = {
      maxOutputTokens: 400
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        }
      ],
      generationConfig,
    });

    interaction.editReply({
      content: result.response.text()
    });
  },
};
