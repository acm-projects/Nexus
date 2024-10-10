import React from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { useState } from 'react'; //use to make sidebar collapsible
import { Link } from 'react-router-dom';

const CoursesPage = () =>{
    return(
        <div className = "flex">
            <div className = "bg-gradient-to-b from-nexus-blue-200 via-white to-nexus-blue-200 h-screen p-5 w-100 relative flex flex-col justify-start items-center sidebar">
                <BsArrowLeftShort className = "bg-white text-nexus-blue-900 text-3xl rounded-full absolute -right-3 top-20 border border-nexus-blue-900 cursor-pointer"/>
                <h1 className = "pt-20 pb-5 text-2xl sidebar-title">My Courses</h1>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 1</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 2</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 3</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 4</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 5</button>
                    <div className = "mt-auto">
                        <Link to = "/upload" className = "p-2 pb-3 pt-3 rounded-lg bg-nexus-blue-200 text-white transition duration 300 hover:text-white transform hover:bg-nexus-blue-300">Upload Doc</Link> 
                    </div>
            </div>
            <div className = "bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 w-screen">
                <h1 className = "pt-20 text-white text-2xl flex justify-center">Navigate to a Course to Access Chatrooms</h1>
            </div>
        </div>
    );
};

export default CoursesPage;