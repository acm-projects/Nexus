import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiEyeOff, HiPlus, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Select from 'react-select';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([
    { course: '', courseNumber: '', courseSection: '' },
  ]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Fetch courses from CSV file
    fetch('src/assets/courses.csv')
      .then((response) => response.text())
      .then((data) => {
        const courseList = data
          .split('\n')
          .filter((course) => course.trim() !== '');
        setCourses(courseList);
      })
      .catch((error) => console.error('Error loading courses:', error));
  }, []);

  const isValidCourse = (course) => {
    return (
      course.course &&
      /^\d{4}$/.test(course.courseNumber) &&
      /^\d{3}$/.test(course.courseSection)
    );
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = userCourses.map((course, i) => {
      if (i === index) {
        return { ...course, [field]: value };
      }
      return course;
    });
    setUserCourses(updatedCourses);
    setShowWarning(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Implement registration logic here
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
    const lastCourse = userCourses[userCourses.length - 1];
    if (userCourses.length < 5 && isValidCourse(lastCourse)) {
      setUserCourses([
        ...userCourses,
        { course: '', courseNumber: '', courseSection: '' },
      ]);
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  const handleRemoveCourse = (index) => {
    const updatedCourses = userCourses.filter((_, i) => i !== index);
    setUserCourses(updatedCourses);
    setShowWarning(false);
  };

  const courseOptions = courses.map((course) => ({
    value: course,
    label: course,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: 'nexus-white',
      minHeight: '42px',
    }),
    option: (provided) => ({
      ...provided,
      color: 'nexus-blue-600',
    }),
  };

  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-2 text-base";

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg bg-gradient-to-b from-nexus-blue-100 via-white to-nexus-blue-10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          className="text-2xl font-bold mb-6 text-nexus-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Create Nexus Account
        </motion.h2>
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-nexus-blue-600 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={inputClassName}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </motion.div>
              <motion.div
                className="mb-6 relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-nexus-blue-600 mb-1"
                >
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`${inputClassName} pr-10`}
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
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-3 gap-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-nexus-blue-600 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className={inputClassName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-nexus-blue-600 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className={inputClassName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-nexus-blue-600 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={inputClassName}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                </div>
              </motion.div>
              {userCourses.map((userCourse, index) => (
                <motion.div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 rounded-md relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <label
                        htmlFor={`course-${index}`}
                        className="block text-sm font-medium text-nexus-blue-600 mb-1"
                      >
                        Course
                      </label>
                      <Select
                        id={`course-${index}`}
                        options={courseOptions}
                        value={courseOptions.find(
                          (option) => option.value === userCourse.course
                        )}
                        onChange={(selectedOption) =>
                          handleCourseChange(
                            index,
                            'course',
                            selectedOption.value
                          )
                        }
                        placeholder="Course"
                        styles={customStyles}
                        className="text-nexus-blue-800"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`courseNumber-${index}`}
                        className="block text-sm font-medium text-nexus-blue-600 mb-1"
                      >
                        Course Number
                      </label>
                      <input
                        type="text"
                        id={`courseNumber-${index}`}
                        className={inputClassName}
                        value={userCourse.courseNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 4);
                          handleCourseChange(index, 'courseNumber', value);
                        }}
                        pattern="\d{4}"
                        maxLength="4"
                        placeholder="Course #"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`courseSection-${index}`}
                        className="block text-sm font-medium text-nexus-blue-600 mb-1"
                      >
                        Course Section
                      </label>
                      <input
                        type="text"
                        id={`courseSection-${index}`}
                        className={inputClassName}
                        value={userCourse.courseSection}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 3);
                          handleCourseChange(index, 'courseSection', value);
                        }}
                        pattern="\d{3}"
                        maxLength="3"
                        placeholder="Section"
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
                </motion.div>
              ))}
              {userCourses.length < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="mb-2 flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nexus-blue-600 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexus-blue-500"
                  >
                    <HiPlus className="mr-2" /> Add Course
                  </button>
                  {showWarning && (
                    <p className="text-red-500 text-sm mt-1">
                      Please fill out all fields correctly before adding a new
                      course.
                    </p>
                  )}
                </motion.div>
              )}
            </>
          )}
          <motion.button
            type="submit"
            className="w-full bg-nexus-blue-600 text-white rounded-md py-2 px-4 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-nexus-blue-500 focus:ring-opacity-50 text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {step === 1 ? 'Next' : 'Create Account'}
          </motion.button>
        </form>
        {step === 1 && (
          <motion.p
            className="mt-4 text-center text-sm text-nexus-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-nexus-blue-800 group relative"
            >
              LOG IN HERE
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
            </Link>
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;