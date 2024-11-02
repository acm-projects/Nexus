import React, { useState, useRef, useEffect } from 'react';
import { HiUpload, HiDocumentText } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';

const UploadDoc = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [location, setLocation] = useState(null);
    const [unit, setUnit] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

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

    const fetchCourses = async () => {
        const token = localStorage.getItem('token');
        if (!token){ 
            console.log("Token undefined");
            return; }

        try {
            const response = await axios.get('http://localhost:3000/api/misc/getOnboardedCourses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const fetchedCourses = response.data.courses;
            console.log("Upload Doc fc:",fetchedCourses);
            setCourses(fetchedCourses);
            const locationOptionsForCourses = fetchedCourses.map((course) => ({
                value: course.courseId,
                label: `${course.courseCode}-${course.courseNumber}`
            }));

            console.log(locationOptionsForCourses);

            setLocationOptions(locationOptionsForCourses);
            console.log("fetchedCourses[0]?.courseId",fetchedCourses[0]?.courseId);
           // fetchUnits(fetchedCourses[0]?.courseId); // Fetch units for the first course if available
        } catch (error) {
            console.error('Error fetching courses:', error.response?.data?.message || error.message);
        }
    };

    const fetchUnits = async (courseId) => {
        if (!courseId) return; // Ensure a valid course ID is passed
        try {
            const response = await axios.post('http://localhost:3000/api/download/aws', {
                sectionId: courseId
            });
            console.log('fetch units:',response);
            if (response.data.object.units) {
                const mappedUnits = response.data.object.units.map((unit) => ({
                    value: unit.unitid,
                    label: unit.unitName,
                }));
                console.log("Mapped Units:",mappedUnits);
                setUnitOptions(mappedUnits);
            }
        } catch (error) {
            console.error("Error fetching Units: ", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);
    useEffect(() => {
        if (location) {
            fetchUnits(location.value);
        }
    }, [location]);

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
        let unitLable = '';
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
        if (!unit) {
            setMessage('Please select a unit.');
            return;
        }
        
        // Create a temporary URL for the file
        let fileUrl = URL.createObjectURL(file);
        console.log("Unit Value:",unit.value);

        //
        
        const formData = new FormData();
        formData.append('media',file);
        formData.append('unitid',unit.value);
        try{
            setMessage('File starting to upload!');
            const response = await axios.post('http://localhost:3000/api/upload/aws',formData,{
                headers:{
                    'Content-Type ': 'multipart/form-data',
                },
            });
            fileUrl = response.data.superdoc;
            //console.log('Response: ',response);
            console.log('superdoc url :', fileUrl);
            setMessage('File uploaded successfully!');
        } catch(error){
            console.log(error);
        }

        
        
        //


        // Navigate to the DocPreview page with file information
        const state = {
            fileName: file.name,
            fileUrl,
            selectedUnit: unit.label ? unit.label : unitLable,
            documentName: documentName, 
            selectedCourse: location.value
        }
        console.log(state);
        
        navigate('/doc-preview', {
            state
        }); 
    };

    const handleAddUnit = async () => {
    let unitid = '';
    const lastUnit = unitOptions.length ? unitOptions[unitOptions.length - 1] : null;
    const lastUnitNumber = lastUnit ? parseInt(lastUnit.label.split(' ')[1]) : 0;

    try {
        const pdfDoc = await PDFDocument.create();
        pdfDoc.addPage(); // Add an empty page
        const pdfBytes = await pdfDoc.save();

        // Create a Blob from the PDF bytes
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Prepare FormData with the blank PDF
        const formData = new FormData();
        formData.append("media", pdfBlob, "blank.pdf");

        // Upload the file and get the new unit ID
        const response = await axios.post('http://localhost:3000/api/upload/aws', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("Unit Response:",response.data);
        unitid = response.data.unitid;

        // Add the new unit to `unitOptions`
        const newUnitObj = {
            value: unitid,
            label: `Unit ${lastUnitNumber + 1}`
        };

        let updatedUnits = [];

        setUnitOptions((prevUnits) => {
            updatedUnits = [...prevUnits, newUnitObj];
            console.log("Updated units within callback:", updatedUnits);
            return updatedUnits;
        });

        //Making an array of units to feed back into database
        const mappedBackUnits = updatedUnits.map((unit) => ({
            unitid: unit.value,
            unitName: unit.label,
        }));

        try {
            // Post new unit data
            await axios.post('http://localhost:3000/api/upload/aws', {
                sectionId: location.value,
                units: mappedBackUnits,
            });
            setMessage(`Unit "${unitid}" added successfully.`);
        } catch (error) {
            console.log("Error Adding Unit: ", error);
            setMessage('Failed to add new unit.');
        }
    
        return newUnitObj.label; 

    } catch (error) {
        console.log("Error Adding Unit: ", error);
        setMessage('Failed to add new unit.');
        return ''; // return empty string to indicate failure
    }
    };

    return (
        <motion.div
            className="min-h-screen inset-0 bg-gradient-to-bl from-nexus-blue-700 via-nexus-blue-900 to-nexus-blue-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md bg-gradient-to-b from-nexus-blue-100 via-white to-nexus-blue-100"
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <input
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="Document Name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-nexus-blue-500 focus:border-nexus-blue-500"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Select
                            placeholder="Select Location"
                            options={locationOptions}
                            styles={customStyles}
                            onChange={setLocation}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Select
                            placeholder="Select Unit"
                            options={unitOptions}
                            styles={customStyles}
                            onChange={setUnit}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <button
                            type="button"
                            onClick={handleAddUnit}
                            className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                        >
                            Add Unit
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                className={`mt-2 text-center text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                    >
                        Upload
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default UploadDoc;
