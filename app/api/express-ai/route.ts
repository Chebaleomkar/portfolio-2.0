import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const { moods, prompt, originalMessage } = await request.json();

        console.log("moods" , moods)
        console.log("Prompt" , prompt)
        console.log("OriginalMessage" , originalMessage)

        if (!moods || !originalMessage) {
            return NextResponse.json(
                { error: "Missing required fields in the request body." },
                { status: 400 }
            );
        }

        const ollamaPrompt = `
        You are a helpful AI assistant that enhances messages based on the user's mood and instructions.
        Moods: ${moods.join(", ")}
        Instructions: ${prompt || 'Enhance the message and tone with above given mood '}
        Original Message: ${originalMessage}
        Please enhance the message to match the specified mood and follow the instructions. Return ONLY the enhanced message, without any additional explanations or text.
        `;

        // Make a POST request to Ollama's API
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3.1", // Replace with your Ollama model name
            prompt: ollamaPrompt,
            stream: false, // Set to true if you want to stream the response
        });

        const generatedMessage = response.data.response;
        console.log(generatedMessage)
        return NextResponse.json({ generatedMessage }, { status: 200 });
    } catch (error) {
        console.error("Error in /api/expressly-ai:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}