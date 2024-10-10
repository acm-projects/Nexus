import React,{useState} from "react";
import { FiHexagon } from "react-icons/fi";
import { motion } from "framer-motion";
const GradeCalculator = () =>{
    const [category, setCategory] = useState("");
    const [categoryWeight, setCategoryWeight] = useState("");
    return(
        <div className = "bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-screen w-screen">
            <div className = "flex flex-col justify-center items-center">
            <motion.h1 
                className = "pt-20 pb-10 font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
            Enter the name and weight of each category, as well as the desired final grade in the class.
            </motion.h1>
            <h1 className = "p-3 rounded-full text-xl text-nexus-blue-900 bg-nexus-blue-200 size-1/3 text-center"><strong>Grade Required:</strong><br/>90%</h1>
            <div className = "pt-6 grid grid-cols-2 categories">
                <div className = "p-2 bg-gradient-to-b from-nexus-blue-200 via-white to-nexus-blue-200 grid grid-cols-2category">
                    <div className = "flex flex-row items-center">
                    <label htmlFor="category" className="pr-3 block text-sm font-medium text-nexus-blue-600">Category</label>
                    <input
                        type="text"
                        id="category"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 pr-10 p-1"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Enter Category"
                        required
                    />
                    <label htmlFor="category-weight" className = "pl-3 pr-3 block text-xs font-medium text-nexus-blue-600">Weight (%)</label>
                    <input
                        type="number"
                        id="category-weight"
                        className="mt-1 pr-0 pl-3 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 pr-10 p-1"
                        value={categoryWeight}
                        onChange={(e) => setCategoryWeight(e.target.value)}
                        placeholder="Wt"
                        required
                    />
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default GradeCalculator;