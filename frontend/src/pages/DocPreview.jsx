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
  const { fileName, fileUrl, selectedUnit, documentName, selectedCourse } = location.state || {};
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pageWidth, setPageWidth] = useState(600);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUnit, setCurrentUnit] = useState('Unit 1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scale, setScale] = useState(1);
  //const [courses, setCourses] = useState([]);
  const [unitUrls, setUnitUrls] = useState([]);
  const [untiIds, setUnitIds] = useState([]);
  const [units, setUnits] = useState(['Unit 1', 'unit2', 'unit3', 'unit4']);

/*
  const fetchCourses = async () => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:3000/api/misc/getOnboardedCourses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Course fetch:",response);
      //fetchedCourses = response.data.courses;
      setCourses(response.data.courses);  // Set the courses in state
      console.log('Fetched courses:', response.data.courses);

    } catch (error) {
      console.error('Error fetching courses:', error.response?.data?.message || error.message);
    }
  };

    */
  const fetchUnits = async () => {
    try {
      const unitUrlsMap = {};
      //courseId = courseId ? courseId : courses[0]?.courseId;

      // Assuming courses[0] is valid and has courseId
      //console.log("CourseID:",courses[0]?.courseId);
      console.log("CourseID:",selectedCourse);
      const response = await axios.post('http://localhost:3000/api/download/aws', {
        sectionId: selectedCourse
      });
      console.log("Response:",response.data);
      if (response.data.object.units) {

        const mapped_unitIds = response.data.object.units.map((unit)=>(unit.unitid));
        const mapped_unitNames = response.data.object.units.map((unit)=>(unit.unitName));
        console.log("Mapped_untiIds:",mapped_unitIds);
        console.log("Mapped_names:",mapped_unitNames);
        setUnitIds(mapped_unitIds); // Update units state
        setUnits(mapped_unitNames);
        
        await Promise.all(
          mapped_unitIds.map(async (unitid, index) => {
            try {
              const response = await axios.post('http://localhost:3000/api/download/aws', {
                 unitid: unitid 
              });
              console.log("Unit Url Response:",response);
              // Store the URL in the unitUrlsMap with the index as the key or in any required format
              unitUrlsMap[index] = response.data.presignedUrl;  // You can also store it with the index if needed, e.g., unitUrlsMap[index] = response.data.url;
              console.log(`Fetched URL for ${unitid}: ${response.data.presignedUrl}`);
            } catch (error) {
              console.error(`Error fetching URL for ${unitid}:`, error);
            }
          })
        );

        console.log("UrlsMap: ",unitUrlsMap);
        setUnitUrls(unitUrlsMap); // Update state with fetched URLs
      }
    } catch (error) {
      console.error("Error fetching Units: ", error);
    }
  };

  /*
  useEffect(() => {
    if(courses.length==0){
      fetchCourses();
    }    
  }, []); // Add courses to dependency array
  */
  useEffect(() => {
    fetchUnits();
    
  }, [selectedCourse]);
  

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
    //console.log("CurrentUnit:",currentUnit);
    //console.log("selectedUnit:",selectedUnit);
    if (currentUnit) {
      const currentIndex = units.indexOf(currentUnit); // Find the index of currentUnit
      //console.log("CurrentIndex:",currentIndex);
      const currentUrl = currentIndex !== -1 ? unitUrls[currentIndex] : null; // Get the URL using the unit at currentIndex
      //console.log("current url:",currentUrl);
      if (currentUrl) {
        return (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              {/* Navigation buttons and zoom controls */}
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage <= 1}>
                Previous
              </button>
              <span>Page {currentPage} of {numPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))} disabled={currentPage >= numPages}>
                Next
              </button>
              <button onClick={zoomOut}>Zoom Out</button>
              <span>{Math.round(scale * 100)}%</span>
              <button onClick={zoomIn}>Zoom In</button>
            </div>
            <div className="flex justify-center p-4 bg-gray-50">
              <Document
                file={currentUrl}  // Use the URL for the current unit
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
            <h2>No Document Uploaded</h2>
            <p>There is currently no document uploaded for this unit.</p>
            <button onClick={handleUpload}>Upload Document</button>
          </div>
        );
      }
    };
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
          {documentName || `Unit ${currentUnit}`}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DocPreview;