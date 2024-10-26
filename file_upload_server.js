import express from 'express';
import uploadRoutes from './api/fileUploadRoute.js'; // Path to your router file
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;

//
/*
 const formData = new FormData(); 
        formData.append('media',file); 
        formData.append('unitid','1729474828154');
        try{
            setMessage('File starting to upload!');
            const response = await axios.post('http://localhost:3000/upload/aws',formData,{
                headers:{
                    'Content-Type ': 'multipart/form-data',
                },
            });
            console.log('Response: ',response);
            setMessage('File uploaded successfully!');
        } catch(error){
            console.log(error);
        }
*/

// Use the upload routes from the router
app.use(cors({
    origin: 'http://localhost:5173' // Allow your frontend's origin
}));

app.use('/upload', uploadRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
