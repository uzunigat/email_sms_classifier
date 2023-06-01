const express = require('express');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const { check, validationResult } = require('express-validator');

if (!process.env.OPEN_AI_KEY) {
    console.error("Missing OPEN_AI_KEY in environment variables.");
    process.exit(1);
}

const app = express();

app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const emotions = {
    angry: "angry",
    happy: "happy",
    neutral: "neutral"
}

const openai = new OpenAIApi(configuration);

app.post('/classifier',
    [
        check('content').notEmpty().withMessage('Content is required'),
        check('role').notEmpty().withMessage('Role is required'),
        check('with_more_categories').isBoolean().optional().withMessage('with_more_categories must be a boolean'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content, role, with_more_categories } = req.body;

        const responseModelExample = `
            {
                "category": "price",
                "emotion": "angry",
                ${with_more_categories ? `"proposed_category": "different_category_as_the_list",` : ""}
            }
        `

        try {
            const response = await openai.createChatCompletion({
                model:"gpt-3.5-turbo",
                messages: [
                      {"role": "system", "content": `You are a ${role} classifier assistant for hearing aid company named hear.com who has the following categories to analyze and pick: 
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
                      -	no action: Replies that suggest no further engagement is needed, or which express a lack of interest or intent to proceed without showing strong negative emotions or expressly requesting to stop communications. This includes short, non-committal replies like 'No', 'Not now', 'Maybe later', etc
                      - create lead: replies yes or any intent or enthusiasm to move forward with the process
                      `
                    },
                      {"role": "user", "content": `This is the message that our company is sending to the customer to start the SMS chat: 
                      "Hi,  I wanted to follow up with you. 
                        Are you still interested in improving your hearing with the virtually invisible hearing aids by hear.com? 
                        Reply YES so I can secure your participation in our 45-day no-risk trial."
                      `},
                      {"role": "user", "content": `Can you categorize the following response for the first sms message for me by only telling me the category?`},
                      {"role": "user", "content": content},
                      {"role": "user", "content": `Categorize emotion as: ${Object.values(emotions).join(", ")}`},
                      {"role": "user", "content": `Format the output as the following json example (dont forget any json parameter): ${responseModelExample}`},
                  ],
                });

            const responseData = JSON.parse(response.data.choices[0].message.content);
            return res.status(200).json({ success: true, data: responseData });
        } catch (err) {
            console.error(err);
            if (err.response) {
                return res.status(403).json({ success: false, error: err.response.data });
            }
            return res.status(500).json({ success: false, error: "Server Error" });
        }
    }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});