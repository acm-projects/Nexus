import React, { useState, useRef } from 'react';
import { HiUpload, HiDocumentText } from 'react-icons/hi';

const UploadDoc = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [location, setLocation] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        handleFile(selectedFile);
    };

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setMessage('');
            if (!documentName) {
                setDocumentName(selectedFile.name.replace('.pdf', ''));
            }
        } else {
            setFile(null);
            setMessage('Please select a PDF file.');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a PDF file first.');
            return;
        }
        if (!documentName.trim()) {
            setMessage('Please enter a document name.');
            return;
        }
        if (!location) {
            setMessage('Please select a location.');
            return;
        }

        // do something with backend or smthinig idk
        setMessage('Uploaded successfully');
        // do something with backend or smthinig idk

        // something like this maybe..
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('name', documentName);
        // formData.append('location', location);
        // await fetch('/api/upload', { method: 'POST', body: formData });
    };

    return (
        <div className="min-h-screen bg-nexus-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div>
                    <HiDocumentText className="mx-auto h-12 w-12 text-nexus-blue-600" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Upload Document</h2>
                </div>
                <form className="mt-8 space-y-6 text-gray-700" onSubmit={handleUpload}>
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <p className="text-gray-600">Drag and Drop file or</p>
                        <button
                            type="button"
                            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                            }}
                        >
                            Browse
                        </button>
                        <p className="mt-1 text-xs text-gray-500">PDF</p>
                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".pdf"
                            className="sr-only"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="document-name" className="block text-sm font-medium text-gray-700">
                            Document Name
                        </label>
                        <input
                            type="text"
                            id="document-name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nexus-blue-500 focus:border-nexus-blue-500 sm:text-sm"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="Enter document name"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Select Location
                        </label>
                        <select
                            id="location"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nexus-blue-500 focus:border-nexus-blue-500 sm:text-sm rounded-md"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">Select a location</option>
                            {/* Add location routing here */}
                            <option value="location1">Location 1</option>
                            <option value="location2">Location 2</option>
                            <option value="location3">Location 3</option>
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <HiUpload className="h-5 w-5 text-nexus-white group-hover:text-nexus-white" aria-hidden="true" />
                            </span>
                            Upload Doc
                        </button>
                    </div>
                </form>
                {message && (
                    <p className={`mt-2 text-center text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
                {file && (
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Selected file: {file.name}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UploadDoc;