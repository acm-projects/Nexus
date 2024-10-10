import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from "fs";
import dotenv from 'dotenv'; 


import downloadService from './service/download.service.js';
import uploadService from './service/upload.service.js';

dotenv.config(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts buffer data to a GoogleGenerativeAI.Part object.
function bufferToGenerativePart(buffer, mimeType) {
    return {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType,
      },
    };
  }
  
  async function run() {
    const fileNames = ["1728517527540_example-1.pdf", "1728517538280_example-2.pdf"]; // S3 file names
    
    const imageParts = [];
  
    for (const fileName of fileNames) {
      const fileBuffer = await downloadService.downloadFileFromS3(fileName);
      imageParts.push(bufferToGenerativePart(fileBuffer, "application/pdf"));
    }
  
    // Choose a Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Combine both of these documents.";
    
    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    
    // Assuming the generated content is in a suitable format to convert to PDF
    const outputFileName = "output.pdf";
    const outputBuffer = Buffer.from(generatedContent.response.text(), 'utf-8'); // Adjust if the response is in another format
  
    // Upload the generated content back to S3
    const params = {
        name: `${new Date().getTime()}_${outputFileName}`, 
        data: outputBuffer, 
        mimetype: 'application/pdf'

        /* 
            file: {
            name: `${new Date().getTime()}_${outputFileName}`, 
            data: outputBuffer, 
            mimetype: 'application/pdf'
        }

        */
    };

    const uploadRes = await uploadService.uploadFileToAws(params);
    console.log(generatedContent.response.text())
   // console.log(outputBuffer); // Check if it's a Buffer
   // console.log(Buffer.isBuffer(outputBuffer)); // Should be true
   // console.log(params);
    //await uploadFileToS3(bucketName, outputFileName, outputBuffer);
    console.log(`Uploaded ${uploadRes} to S3`);
  }
  
  run().catch(console.error);