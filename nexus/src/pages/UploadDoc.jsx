import React, { useState, useRef } from 'react';
import { HiUpload, HiDocumentText } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';

const UploadDoc = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [location, setLocation] = useState(null);
    const fileInputRef = useRef(null);

    const locationOptions = [
        { value: 'location1', label: 'Location 1' },
        { value: 'location2', label: 'Location 2' },
        { value: 'location3', label: 'Location 3' },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            borderColor: 'rgb(209, 213, 219)',
        }),
        option: (provided) => ({
            ...provided,
            color: '#1e3a8a',
        }),
    };

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

        // do something with backend or something idk
        setMessage('Uploaded successfully');
        // do something with backend or something idk

        // something like this maybe..
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('name', documentName);
        // formData.append('location', location.value);
        // await fetch('/api/upload', { method: 'POST', body: formData });
    };

    return (
        <motion.div 
            className="min-h-screen inset-0 bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <HiDocumentText className="mx-auto h-12 w-12 text-nexus-blue-600" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Upload Document</h2>
                </motion.div>
                <form className="mt-8 space-y-6 text-gray-700" onSubmit={handleUpload}>
                    <motion.div 
                        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        whileHover={{ scale: 1.02, borderColor: '#3B82F6' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <p className="text-gray-600">Drag and Drop file or</p>
                        <motion.button
                            type="button"
                            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Browse
                        </motion.button>
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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Select Location
                        </label>
                        <Select
                            id="location"
                            options={locationOptions}
                            value={location}
                            onChange={setLocation}
                            placeholder="Select a location"
                            styles={customStyles}
                            className="mt-1 block w-full"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <motion.button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <HiUpload className="h-5 w-5 text-nexus-white group-hover:text-nexus-white" aria-hidden="true" />
                            </span>
                            Upload Doc
                        </motion.button>
                    </motion.div>
                </form>
                <AnimatePresence>
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mt-2 text-center text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {file && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-center text-sm text-gray-600"
                        >
                            Selected file: {file.name}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default UploadDoc;