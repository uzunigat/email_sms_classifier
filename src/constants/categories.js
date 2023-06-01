const categories = [
    {name: "price", description: "Queries or remarks regarding the cost of our products, specifically asking about how much a product or service is."},
    {name: "affordability", description: "Inquiries or comments related to the financial feasibility of our products, this includes statements about our products being too expensive or queries about possible discounts or payment plans."},
    {name: "who are you", description: "Questions or comments showing unfamiliarity with the company or its representatives, this includes inquiries about the company's purpose, mission, or its team members."},
    {name: "insurance", description: "Questions or comments about whether insurance covers our products or services, or if the company accepts insurance as a form of payment."},
    {name: "call back", description: "Instances where a customer suggests a better time for the company to contact them, either later in the day or in the foreseeable future."},
    {name: "cannot hear", description: "When someone indicates difficulty in communication due to hearing challenges and prefers not to engage in a phone call conversation."},
    {name: "opt-in", description: "Explicit requests to start receiving messages or communications after previously opting out or showing interest in subscribing to a newsletter, updates, or promotional messages."},
    {name: "opt-out", description: " Statements where the user expresses a desire to stop receiving specific messages from this company or about a particular topic, but doesn't indicate a complete cessation of all communications."},
    {name: "blacklist", description: "Expressions of strong displeasure, frustration, or anger, often indicated by harsh language, suggesting that the user wishes to entirely cease all forms of communication, from any source or about any topic."},
    {name: "unknown", description: "Responses that do not align with any of the above categories or suggest the need for a new category. These may require human intervention for accurate categorization."},
    {name: "no action", description: "Replies that suggest no further engagement is needed, or which express a lack of interest or intent to proceed without showing strong negative emotions or expressly requesting to stop communications. This includes short, non-committal replies like 'No', 'Not now', 'Maybe later', etc"},
    {name: "create lead", description: "Replies yes or any intent or enthusiasm to move forward with the process"}
]

module.exports = {
    categories
}