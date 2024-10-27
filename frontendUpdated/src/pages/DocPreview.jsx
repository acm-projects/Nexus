import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import DocSideBar from '../components/DocSideBar';
import { HiZoomIn, HiZoomOut, HiUpload } from 'react-icons/hi';
import axios from 'axios';  // Import axios

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, fileUrl, selectedUnit, documentName } = location.state || {};
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pageWidth, setPageWidth] = useState(600);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUnit, setCurrentUnit] = useState(selectedUnit || 'unit1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scale, setScale] = useState(1);
  const [courses, setCourses] = useState([]);
  const [unitUrls, setUnitUrls] = useState([]);
  const [units,setUnits] = useState(['unit1', 'unit2', 'unit3', 'unit4']);

  useEffect(() => {
    // Fetch user courses using Axios
    const fetchCourses = async () => {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3000/api/misc/getOnboardedCourses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setCourses(response.data.courses);  // Set the courses in state
        console.log('Fetched courses:', response.data.courses);

      } catch (error) {
        console.error('Error fetching courses:', error.response?.data?.message || error.message);
      }
    };

    const fetchUnits = async () => {
      try {
        const unitUrlsMap = {};

        // Assuming courses[0] is valid and has courseId
        const response = await axios.get('http://localhost:3000/api/download/aws', {
          params: {
            sectionId: courses[0]?.courseId, // Fetch units based on the first course
          },
        });

        if (response.data.units && response.data.units.length > 0) {
          setUnits(response.data.units); // Update units state

          await Promise.all(
            units.map(async (unit, index) => {
              try {
                const response = await axios.get('http://localhost:3000/api/download/aws', {
                  params: { unitid: unit }, // Assuming 'unit' is what you need to send
                });
                
                // Store the URL in the unitUrlsMap with the index as the key or in any required format
                unitUrlsMap[index] = response.data.url;  // You can also store it with the index if needed, e.g., unitUrlsMap[index] = response.data.url;
                console.log(`Fetched URL for ${unit}: ${response.data.url}`);
              } catch (error) {
                console.error(`Error fetching URL for ${unit}:`, error);
              }
            })
          );
        

          setUnitUrls(unitUrlsMap); // Update state with fetched URLs
        }
      } catch (error) {
        console.error("Error fetching Units: ", error);
      }
    };

    fetchCourses();
    fetchUnits();
  }, [courses]); // Add courses to dependency array



  useEffect(() => {
    if (fileUrl && currentUnit === selectedUnit) {
      fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
          setPdfFile(new Blob([blob], { type: 'application/pdf' }));
        })
        .catch(error => {
          console.error('Error fetching PDF:', error);
          setPdfFile(null);
        });
    } else {
      setPdfFile(null);
    }
  }, [fileUrl, currentUnit, selectedUnit]);

  useEffect(() => {
    const updatePageWidth = () => {
      const mainContentWidth = document.getElementById('main-content').offsetWidth;
      setPageWidth(mainContentWidth * 0.75);
    };

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);

    return () => window.removeEventListener('resize', updatePageWidth);
  }, [isSidebarCollapsed]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleUnitChange = (unit) => {
    setCurrentUnit(unit);
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleUpload = () => {
    navigate('/upload');
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const renderContent = () => {
    if (currentUnit === selectedUnit && pdfFile) {
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-nexus-blue-600 text-white rounded disabled:opacity-50 mr-2"
              >
                Previous
              </button>
              <span className="mx-2">Page {currentPage} of {numPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
                disabled={currentPage >= numPages}
                className="px-4 py-2 bg-nexus-blue-600 text-white rounded disabled:opacity-50 ml-2"
              >
                Next
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={zoomOut}
                className="px-4 py-2 bg-nexus-blue-600 text-white rounded mr-2"
              >
                <HiZoomOut />
              </button>
              <span className="mx-2 text-gray-700">{Math.round(scale * 100)}%</span>
              <button
                onClick={zoomIn}
                className="px-4 py-2 bg-nexus-blue-600 text-white rounded ml-2"
              >
                <HiZoomIn />
              </button>
            </div>
          </div>
          <div className="flex justify-center p-4 bg-gray-50">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-col items-center"
            >
              <Page
                pageNumber={currentPage}
                width={pageWidth * scale}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                renderInteractiveForms={false}
              />
            </Document>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 text-center">
          <HiUpload className="mx-auto text-6xl text-nexus-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Document Uploaded</h2>
          <p className="text-gray-600 mb-4">There is currently no document uploaded for this unit.</p>
          <button 
            className="bg-nexus-blue-600 text-white py-2 px-4 rounded hover:bg-nexus-blue-700 transition duration-300"
            onClick={handleUpload}
          >
            Upload Document
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen pt-16">
      <DocSideBar 
        units={units} 
        selectedUnit={currentUnit} 
        onUnitChange={handleUnitChange}
        onToggle={handleSidebarToggle}
      />
      <div 
        id="main-content"
        className={`flex-1 bg-gradient-to-b from-nexus-blue-100 via-white to-nexus-blue-100 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            {currentUnit === selectedUnit && documentName ? documentName : `Unit ${currentUnit.slice(-1)}`}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DocPreview;