import React, { useState } from 'react';
import Logo from './assets/Logo.svg';

const Register = () => {
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };

  return (
    <div className="rid grid-cols-1 place-content-evenly">
      <div className="flex flex-col items-center min-h-screen w-screen bg-gray-100">

        <div className="flex items-center pt-10">
          <h2 className="text-xl text-left text-black font-bold">WELCOME TO <br / > CREATE YOUR ACCOUNT</h2>
          <img src={Logo} className="w-52 h-52 px-7" alt="Logo" />
        </div>
        

        {/*button change states*/}
        <div className="flex justify-evenly w-52 pb-14">
        <button
          onClick={() => handleButtonClick(1)}
          className={`rounded-full text-black ${activeButton === 1 ? 'bg-fuchsia-300' : 'bg-gray-300'}`}
        >
          1
        </button>
        <button
          onClick={() => handleButtonClick(2)}
          className={`rounded-full text-black ${activeButton === 2 ? 'bg-fuchsia-300' : 'bg-gray-300'}`}
        >
          2
        </button>
        <button
          onClick={() => handleButtonClick(3)}
          className={`rounded-full text-black ${activeButton === 3 ? 'bg-fuchsia-300' : 'bg-gray-300'}`}
        >
          3
        </button>
      </div>
      {/*button change states*/}


        {/* Registration form */}
        <form className="flex flex-col items-center space-y-4 w-full max-w-sm">
          <input
            type="text"
            placeholder="Email"
            className="bg-white text-gray-400 p-2 border border-gray-300 rounded w-full"
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white p-2 text-gray-00 border border-blue-300 rounded w-full"
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
            CREATE ACCOUNT
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Register;