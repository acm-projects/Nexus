import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// Turn images to Part objects
const filePart1 = fileToGenerativePart("example-1.pdf", "application/pdf")
const filePart2 = fileToGenerativePart("example-2.pdf", "application/pdf")


async function run() {
    // Choose a Gemini model.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = "Describe the differences between these documents.";
  
    const imageParts = [
      filePart1,
      filePart2
    ];
  
    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    
    console.log(generatedContent.response.text());
  }
  
  run();