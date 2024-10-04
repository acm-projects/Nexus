import React, { useState } from 'react';
//template code, figure out + change later
const UploadDoc = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('File uploaded successfully!');
            } else {
                setMessage('File upload failed.');
            }
        } catch (error) {
            setMessage('An error occurred during file upload.');
        }
    };

    return (
        <div>
            <h1>Upload Document</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadDoc;