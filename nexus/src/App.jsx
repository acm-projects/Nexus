import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import GetStarted from './assets/Get Started Button.svg';
import Register from './Register'; // Import the Register component
const App = () => {
  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} />
      </Routes>

    </Router>
  );
};

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-white" style={{ backgroundColor: 'var(--blue-a8)' }}>
    <h1 className="text-4xl font-bold mb-8 pt-10">NEXUS: A free hub for all students</h1>
    {/*get started button*/}
    <a href="/signup" className="mb-8">
      <img src={GetStarted} className="w-25 h-auto pb-10" alt="Get Started button" />
    </a>

    {/*courses, grade calc, and superdoc info*/}
    <div className="flex justify-center space-x-4 mb-8">
      <div className="infoBox bg-opacity-50 bg-blue-500 p-4 rounded-lg text-left">
        <h2 className="text-left text-lg font-semibold">Courses:</h2>
        Automatically links you and your classmates into a group chat by section.
      </div>
      <div className="infoBox bg-opacity-50 bg-blue-500 p-4 rounded-lg text-left">
        <h2 className="text-left text-lg font-semibold">Grade Calculator:</h2>
        Project the impact of a quiz or exam onto your grade!
      </div>
      <div className="infoBox bg-opacity-50 bg-blue-500 p-4 rounded-lg text-left">
        <h2 className="text-left text-lg font-semibold">Superdoc:</h2>
         Compile you and your classmate’s typed notes into a summarized doc!
      </div>
    </div>
    {/*courses, grade calc, and superdoc info*/}

    <div className="aboutContainer bg-opacity-50 flex-col w-full max-w-3xl bg-gray-800 p-6 rounded-lg">
      <p className="text-left text-xl font-semibold mb-4">About:</p>
      <p className="text-left">
      Nexus addresses the challenges of accessibility and inclusivity 
      in student group chats by offering a centralized platform where 
      every course automatically has a dedicated group. It enables 
      students to communicate, share study notes, and collaborate using 
      advanced tools like forums, document sharing, and a feature that 
      consolidates typed notes into a comprehensive master document. 
      By making course-specific groups easily accessible to all students, 
      Nexus enhances collaboration, planning, and academic success.
      </p>
    </div>
  </div>
);

export default App;