import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import DocSideBar from '../components/DocSideBar';
import { HiZoomIn, HiZoomOut, HiUpload } from 'react-icons/hi';
import axios from 'axios';
import Select from 'react-select';




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
const [courses, setCourses] = useState([]);
const [selectedCourseOption, setSelectedCourseOption] = useState(null);
const [unitUrls, setUnitUrls] = useState([]);
const [unitIds, setUnitIds] = useState([]);
const [units, setUnits] = useState(['Unit 1']);




const ZOOM_STEP = 0.1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;




useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    }
  };




  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [scale]);




const fetchCourses = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;




  try {
    const response = await axios.get('http://localhost:3000/api/misc/getOnboardedCourses', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const fetchedCourses = response.data.courses;
    setCourses(fetchedCourses);
  
    const courseOptions = fetchedCourses.map(course => ({
      value: course.courseId,
      label: `${course.courseCode}-${course.courseNumber}`
    }));




    if (courseOptions.length > 0) {
      setSelectedCourseOption(courseOptions[0]);
      fetchUnits(courseOptions[0].value);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};




const fetchUnits = async (courseId) => {
  if (!courseId) return;
  try {
    const unitUrlsMap = {};
    const response = await axios.post('http://localhost:3000/api/download/aws', {
      sectionId: courseId
    });
  
    if (response.data.object.units) {
      const mapped_unitIds = response.data.object.units.map((unit)=>(unit.unitid));
      const mapped_unitNames = response.data.object.units.map((unit)=>(unit.unitName));
      console.log("Mapped_untiIds:",mapped_unitIds);
      console.log("Mapped_names:",mapped_unitNames);
      setUnitIds(mapped_unitIds);
      setUnits(mapped_unitNames);
    
      await Promise.all(
        mapped_unitIds.map(async (unitid, index) => {
          try {
            const response = await axios.post('http://localhost:3000/api/download/aws', {
               unitid: unitid
            });
            console.log("Unit Url Response:",response);
            unitUrlsMap[index] = response.data.presignedUrl;
            console.log(`Fetched URL for ${unitid}: ${response.data.presignedUrl}`);
          } catch (error) {
            console.error(`Error fetching URL for ${unitid}:`, error);
          }
        })
      );




      console.log("UrlsMap: ",unitUrlsMap);
      setUnitUrls(unitUrlsMap);
    }
  } catch (error) {
    console.error("Error fetching Units: ", error);
  }
};




useEffect(() => {
  fetchCourses();
}, []);




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




const handleCourseChange = (selectedOption) => {
  setSelectedCourseOption(selectedOption);
  fetchUnits(selectedOption.value);
};




const handleZoomIn = () => {
  setScale(prevScale => Math.min(prevScale + ZOOM_STEP, MAX_SCALE));
};




const handleZoomOut = () => {
  setScale(prevScale => Math.max(prevScale - ZOOM_STEP, MIN_SCALE));
};




const resetZoom = () => {
  setScale(1);
};




const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: 'rgb(209, 213, 219)',
    width: '300px',
    marginBottom: '1rem'
  }),
  option: (provided) => ({
    ...provided,
    color: '#1e3a8a',
  }),
};




const renderContent = () => {
  if (currentUnit) {
    const currentIndex = units.indexOf(currentUnit);
    console.log('currentIndex:', currentIndex);
    const currentUrl = currentIndex !== -1 ? unitUrls[currentIndex] : null;




    console.log('currentUrl:', currentUrl);




    if (currentUrl) {
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-nexus-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-nexus-blue-700 transition-colors"
              >
                Previous
              </button>
              <span>Page {currentPage} of {numPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
                disabled={currentPage >= numPages}
                className="px-3 py-1 bg-nexus-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-nexus-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center"
                title="Zoom Out (Ctrl -)"
              >
                <HiZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={resetZoom}
                className="px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
                title="Reset Zoom (Ctrl 0)"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center"
                title="Zoom In (Ctrl +)"
              >
                <HiZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-center p-4 bg-gray-50 overflow-auto min-h-[600px]">
            <Document
              file={currentUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-col items-center"
            >
              <Page
                key={`page_${currentPage}_${scale}`}
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
          <h2 className="text-xl font-semibold mb-2">No Document Uploaded</h2>
          <p className="text-gray-600 mb-4">There is currently no document uploaded for this unit.</p>
          <button
            onClick={handleUpload}
            className="mt-4 bg-nexus-blue-600 text-white px-4 py-2 rounded hover:bg-nexus-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <HiUpload className="mr-2" />
            Upload Document
          </button>
        </div>
      );
    }
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
        <div className="mb-6">
          <Select
            value={selectedCourseOption}
            onChange={handleCourseChange}
            options={courses.map(course => ({
              value: course.courseId,
              label: `${course.courseCode}-${course.courseNumber}`
            }))}
            styles={customSelectStyles}
            placeholder="Select Course"
          />
        </div>
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