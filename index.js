const express = require('express');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();

app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/test', async (req, res) => {

    const {text} = req.body;
    try{

        const response = await openai.createCompletion({
            model:"gpt-3.5-turbo",
            messages: [
                  {"role": "system", "content": "You are an SMS oclassifier assistant."},
                  {"role": "user", "content": text},
                  {"role": "user", "content": `Can you categorize this text for me (Depneding on the following options):
                  1. Opt-in
                  2. Opt-out
                  `},
              ]
            });

        return res.status(200).json({success: true, 
        data: response.data.choices[0].text
    })
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, 
            error: err.response ? err.response.data : "Server Error"})
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(    `Server is running on port ${port}.`);
});