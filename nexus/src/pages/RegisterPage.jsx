import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiEyeOff, HiPlus, HiX } from 'react-icons/hi';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([{ course: '', courseNumber: '', courseSection: '' }]);

  useEffect(() => {
    // Fetch courses from CSV file
    fetch('src/assets/courses.csv')
      .then(response => response.text())
      .then(data => {
        const courseList = data.split('\n').filter(course => course.trim() !== '');
        setCourses(courseList);
      })
      .catch(error => console.error('Error loading courses:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Implement registration logic or somehting idk lol
      console.log('Registration submitted', {
        email,
        password,
        firstName,
        lastName,
        username,
        userCourses,
      });
    }
  };

  const handleAddCourse = () => {
    if (userCourses.length < 5) {
      setUserCourses([...userCourses, { course: '', courseNumber: '', courseSection: '' }]);
    }
  };

  const handleRemoveCourse = (index) => {
    const updatedCourses = userCourses.filter((_, i) => i !== index);
    setUserCourses(updatedCourses);
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = userCourses.map((course, i) => {
      if (i === index) {
        return { ...course, [field]: value };
      }
      return course;
    });
    setUserCourses(updatedCourses);
  };

  return (
    <div className="min-h-screen bg-nexus-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-nexus-blue-800">Create Nexus Account</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-nexus-blue-600">Email</label>
                {/*input validation for email*/}
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="mb-6 relative">
                <label htmlFor="password" className="block text-sm font-medium text-nexus-blue-600">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff className="h-5 w-5 text-gray-500" /> : <HiEye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-nexus-blue-600">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-nexus-blue-600">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-nexus-blue-600">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                </div>
              </div>
              {userCourses.map((userCourse, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md relative">
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <label htmlFor={`course-${index}`} className="block text-sm font-medium text-nexus-blue-600">Course</label>
                      <select
                        id={`course-${index}`}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800"
                        value={userCourse.course}
                        onChange={(e) => handleCourseChange(index, 'course', e.target.value)}
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`courseNumber-${index}`} className="block text-sm font-medium text-nexus-blue-600">Course Number</label>
                      <input
                        type="text"
                        id={`courseNumber-${index}`}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800"
                        value={userCourse.courseNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          handleCourseChange(index, 'courseNumber', value);
                        }}
                        pattern="\d{4}"
                        maxLength="4"
                        placeholder="Course #"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`courseSection-${index}`} className="block text-sm font-medium text-nexus-blue-600">Course Section</label>
                      <input
                        type="text"
                        id={`courseSection-${index}`}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800"
                        value={userCourse.courseSection}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          handleCourseChange(index, 'courseSection', value);
                        }}
                        pattern="\d{3}"
                        maxLength="3"
                        placeholder="Course section"
                        required
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <HiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {userCourses.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="mb-4 flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                >
                  <HiPlus className="mr-2" /> Add Course
                </button>
              )}
            </>
          )}
          <button
            type="submit"
            className="w-full bg-nexus-blue-600 text-white rounded-md py-2 px-4 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-nexus-blue-500 focus:ring-opacity-50"
          >
            {step === 1 ? 'Next' : 'Create Account'}
          </button>
        </form>
        {step === 1 && (
          <p className="mt-4 text-center text-sm text-nexus-blue-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-nexus-blue-800 hover:underline">
              LOG IN HERE
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;