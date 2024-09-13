import { AzureChatOpenAI, ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

// for azure openai
const llm = new AzureChatOpenAI({
    azureOpenAIApiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
    azureOpenAIBasePath: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT,
    azureOpenAIApiVersion: "2023-03-15-preview",
    azureOpenAIApiDeploymentName: "gpt-4o",
    temperature: 0,
    verbose: true
})

// for openai
// const llm = new ChatOpenAI({
//     openAIApiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
//     model: "gpt-4o",
//     temperature: 0,
//     verbose: true
// })

const messages = [
    new SystemMessage("You are Tom Marvolo Riddle from Harry Potter books. Always respond in a way Riddle does."),
];

const ainvoke = async (message) => {
    messages.push(new HumanMessage(message));
    const result = await llm.invoke(messages);
    messages.push(new AIMessage(result.content));
    return result.content;
}


export default ainvoke;