const express = require('express');
require('dotenv').config();
const { OpenAIApi } = require('openai');
const { emotions } = require('./constants/emotions');
const { configuration } = require('./config');
const { ChatGPTModel } = require('./constants/models');
const { categories } = require('./constants/categories');
const { categoriesToString } = require('./utils/categories-to-string');
const { firstMessageContent } = require('./constants/first-message-content');

const app = express();

app.use(express.json());

const openai = new OpenAIApi(configuration);

app.post('/classifier', async (req, res) => {

    const {content, role, with_more_categories, with_emotion, first_message_content } = req.body;

    try{

        const responseModelExample = `
            {
                "category": "price",
                ${with_emotion ? `"emotion": "angry",` : ""}
                ${with_more_categories ? `"proposed_category": "different_category_as_the_list",` : ""}
            }
        `

        const response = await openai.createChatCompletion({
            model: ChatGPTModel.GPT_3_TURBO,
            messages: [
                  {"role": "system", "content": `You are a ${role ? role : "SMS"} classifier assistant for hearing aid company. Our company is sending the following message to the customer:
                    ${first_message_content ? first_message_content : firstMessageContent}

                  And the possible categories are:
                  
                    ${categoriesToString(categories)}
                  `
                },
                  {"role": "user", "content": `Can you categorize the following answer for me?:`},
                  {"role": "user", "content": content},
                  with_emotion ? {"role": "user", "content": `Categorize emotion as: ${Object.values(emotions).join(", ")}`} : {"role": "user", "content": ``},
                  {"role": "user", "content": `Format the output as the following json example MANDATORY! (dont forget any json parameter): ${responseModelExample}`},
              ],
            });
            
        return res.status(200).json({success: true, 
        data: JSON.parse(response.data.choices[0].message.content)

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