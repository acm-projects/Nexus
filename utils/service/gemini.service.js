
import { PDFDocument, rgb } from 'pdf-lib';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { jsPDF } from 'jspdf';
import showdown from 'showdown';
import { convert } from 'html-to-text';
import { downloadFileFromS3 } from './download.service.js';
import pdf from 'pdf-parse';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts buffer data to a GoogleGenerativeAI.Part object.
const bufferToGenerativePart = (buffer, mimeType) => ({
    inlineData: {
        data: buffer.toString("base64"),
        mimeType,
    },
});


async function createPDF(textContent) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Size of the page
    const { width, height } = page.getSize();
    
    const fontSize = 12; // Set a smaller font size for more text
    const margin = 50; // Set a margin for text
    const textWidth = width - margin * 2; // Calculate width for text

    const font = await pdfDoc.embedFont('Helvetica'); // Embed the font
    let textLines = []; // Store lines of text
    let currentLine = '';
    
    // Split the content into lines that fit the width
    textContent.split('\n').forEach((line) => {
        const words = line.split(' ');
        
        words.forEach((word) => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize); // Measure text width
            
            if (testWidth > textWidth) {
                // If the line is too long, push the current line to textLines
                textLines.push(currentLine);
                currentLine = word; // Start a new line with the current word
            } else {
                currentLine = testLine; // Otherwise, add the word to the current line
            }
        });
        
        // Push the remaining line if there's any
        if (currentLine) {
            textLines.push(currentLine);
            currentLine = '';
        }
    });

    // Now, we add the lines of text to the PDF
    let yPosition = height - margin; // Start from the top margin
    textLines.forEach((line) => {
        page.drawText(line, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font, // Use the embedded font
            color: rgb(0, 0, 0),
        });
        yPosition -= fontSize + 2; // Move down for the next line

        // Check if we need to add a new page
        if (yPosition < margin) {
            // Add a new page if there's no space left
            yPosition = height - margin; // Reset yPosition for the new page
            pdfDoc.addPage(); // Add a new page
        }
    });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    return pdfBytes; // Return the PDF bytes for uploading
}

async function generatePDF(generatedText) {
    try {
        // Read the markdown file asynchronously
        let markdownContent = generatedText;

        // Convert markdown to HTML
        const converter = new showdown.Converter();
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
        const doc = new jsPDF('p', 'mm', [300, 610]);
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

export const combineWithSuperDoc = async (file, unitid) => {
    try {
        // Turning the current user sent pdf/file to a generative part
        const imageParts = [];
        imageParts.push(bufferToGenerativePart(file.data, "application/pdf"));//file.data.buffer returns actual pdf data
        // Calling the unitid specified superdoc and turning it into a generative part
        const fileBuffer = await downloadFileFromS3(unitid, process.env.AWS_S3_PDF_BUCKET);
    
        //console.log(fileBuffer.toString("utf8")); // returns a string
        imageParts.push(bufferToGenerativePart(fileBuffer, "application/pdf"));

        // Choose a Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Incorporate both of these documents together and avoid redundancy.";

        const generatedContent = await model.generateContent([prompt, ...imageParts]);

       /* const params = await generatePDF(generatedContent.response.text());
        return params;
        */ 
       const resultPDFBytes = await createPDF(generatedContent.response.text());
       return resultPDFBytes
    } catch (error) {
        throw error;
    }
};

export { generatePDF };
