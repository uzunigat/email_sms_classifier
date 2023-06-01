const express = require('express');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();

app.use(express.json());

const emotions = {
    angry: "angry",
    happy: "happy",
    neutral: "neutral"
}

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/classifier', async (req, res) => {

    const {content, role, with_more_categories } = req.body;

    try{

        const responseModelExample = `
            {
                "category": "price",
                "emotion": "angry",
                ${with_more_categories ? `"proposed_category": "different_category_as_the_list",` : ""}
            }
        `

        const response = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages: [
                  {"role": "system", "content": `You are a ${role} classifier assistant for hearing aid company who : 
                  -	price: Queries or remarks regarding the cost of our products, specifically asking about how much a product or service is.
                  -	affordability: Inquiries or comments related to the financial feasibility of our products, this includes statements about our products being too expensive or queries about possible discounts or payment plans.
                  -	who are you: Questions or comments showing unfamiliarity with the company or its representatives, this includes inquiries about the company's purpose, mission, or its team members.
                  -	insurance: Questions or comments about whether insurance covers our products or services, or if the company accepts insurance as a form of payment.
                  -	call back: Instances where a customer suggests a better time for the company to contact them, either later in the day or in the foreseeable future.
                  -	cannot hear: When someone indicates difficulty in communication due to hearing challenges and prefers not to engage in a phone call conversation.
                  -	opt-in: Explicit requests to start receiving messages or communications after previously opting out or showing interest in subscribing to a newsletter, updates, or promotional messages.
                  -	opt-out: Statements where the user expresses a desire to stop receiving specific messages from this company or about a particular topic, but doesn't indicate a complete cessation of all communications.
                  -	blacklist: Expressions of strong displeasure, frustration, or anger, often indicated by harsh language, suggesting that the user wishes to entirely cease all forms of communication, from any source or about any topic.
                  -	unknown: Responses that do not align with any of the above categories or suggest the need for a new category. These may require human intervention for accurate categorization.
                  -	no action: For replies that do not necessitate any further action, this can include polite dismissals, neutral comments, or non-committal language
                  - create lead: replies yes or any intent or enthusiasm to move forward with the process
                  `
                },
                  {"role": "user", "content": `This is the message that our company is sending to the customer: 
                  Hi,  I wanted to follow up with you. 
                    Are you still interested in improving your hearing with the virtually invisible hearing aids by hear.com? 
                    Reply YES so I can secure your participation in our 45-day no-risk trial.
                  `},
                  {"role": "user", "content": `Can you categorize the following text for me by only telling me the category?:`},
                  {"role": "user", "content": content},
                  {"role": "user", "content": `Categorize emotion as: ${Object.values(emotions).join(", ")}`},
                  {"role": "user", "content": `Format the output as the following json example (dont forget any json parameter): ${responseModelExample}`},
              ],
            });
        
            console.log(response.data.choices[0].message.content);
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