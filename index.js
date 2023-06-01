const express = require('express');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();

app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/classifier', async (req, res) => {

    const {content, role} = req.body;

    try{

        const response = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages: [
                  {"role": "system", "content": `You are a ${role} classifier assistant for hearing aid company who only provides one of the following category name as answer: 
                  - price: Any question regarding price of our products
                  - affordability: any question or comment regarding the affordability of our products
                  - who are you: if someone is unsure with whom they are speaking 
                  - insurance: any question regarding insurance
                  - call back: when someone provides a better time to be reached today or in near future
                  - insurance: any question regarding insurance or insurance acceptance
                  - cannot hear: anyone who expresses they don't want to get on a call because they cannot hear well enough
                  - opt-in: replies start or wants to opt back in after opting opt
                  - opt-out: no longer wants to receive messages from this source
                  - blacklist: no longer wants to receive any communication.
                  - unknown: response does not fit into any of the above categories or propose new one to two word category if one does not exist
                  - no action:.`
                },
                  {"role": "user", "content": `Can you categorize the following text for me by only telling me the category name?:
                  `},
              {"role": "user", "content": content},

              ]
            });

            console.log(response.data.choices);

        return res.status(200).json({success: true, 
        category: response.data.choices[0].message.content
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