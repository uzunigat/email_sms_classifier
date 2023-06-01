const { Configuration } = require('openai');


const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
})

module.exports = { configuration }