import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from "fs";
import dotenv from 'dotenv';
import { jsPDF } from 'jspdf';
import { promisify } from "util";
//import pkg from "markdown-to-text";
import showdown from 'showdown';
import { convert } from 'html-to-text';

//import downloadService from './service/download.service.js';
//import uploadService from './service/upload.service.js';
import { downloadFileFromS3 } from './service/download.service.js';
import {uploadUnitToAWS,uploadFileToAWS,checkIfFileExists} from './service/upload.service.js';

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
//const readFileAsync = promisify(fs.readFile);  // Promisify fs.readFile to use async/await

async function generatePDF(generated_text) {
  try {
    // Read the markdown file asynchronously
    let markdownContent = generated_text;

    // Convert markdown to HTML
    var converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(markdownContent);

    // Convert HTML to plain text with formatting options
    const options = {
      wordwrap: 100,
      preserveNewlines: true,
      selectors: [
        { selector: 'a', format: 'skip' },
        { selector: 'h1', format: 'block', options: { leadingLineBreaks: 2, trailingLineBreaks: 1 } }
      ],
      ignoreHref: true,
      ignoreImage: true
    };
    
    const textContent = convert(htmlContent, options);

    // Generate PDF
    var doc = new jsPDF('p', 'mm', [300, 610]);
    doc.text(textContent, 10, 10);

    // Upload the generated PDF to S3
    const params = {
      name: `${new Date().getTime()}_generated.pdf`,
      data: doc.output(),  // Get the PDF content as a data string
      mimetype: 'application/pdf'
    };

    return params;
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  //const fileNames = ["1728517527540_example-1.pdf", "1728517538280_example-2.pdf"]; // S3 file names
  
  const fileNames = ["1729122754666_Nvidia ignite questions.pdf","1729123593515_Indrajith_T_CollegeLife_ECS1100.pdf"]
  
  const imageParts = [];
 
  for (const fileName of fileNames) {
    const fileBuffer = await downloadFileFromS3(fileName, process.env.AWS_S3_PDF_BUCKET);
    imageParts.push(bufferToGenerativePart(fileBuffer, "application/pdf"));
  }
 
  // Choose a Gemini model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = "Combine both of these documents.";
  
  const generatedContent = await model.generateContent([prompt, ...imageParts]);
  
  const params = await generatePDF(generatedContent.response.text());
  
 
  const uploadRes = await uploadUnitToAWS(params);
  //console.log(generatedContent.response.text())
  console.log(`Uploaded ${uploadRes} to S3`);
}




run().catch(console.error);