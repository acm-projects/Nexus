import React, { useState } from "react";
import { motion } from "framer-motion";

const GradeCalculator = () => {
    const [categories, setCategories] = useState([
        { name: "", weight: "", assignments: [{ assignment: "", grade: "", weight: "" }] },
        { name: "", weight: "", assignments: [{ assignment: "", grade: "", weight: "" }] },
    ]);

    const handleCategoryChange = (index, field, value) => {
        const newCategories = [...categories];
        newCategories[index][field] = value;
        setCategories(newCategories);
    };

    const handleAssignmentChange = (categoryIndex, assignmentIndex, field, value) => {
        const newCategories = [...categories];
        newCategories[categoryIndex].assignments[assignmentIndex][field] = value;
        setCategories(newCategories);
    };

    const addCategory = () => {
        setCategories([...categories, { name: "", weight: "", assignments: [{ assignment: "", grade: "", weight: "" }] }]);
    };

    const addAssignmentRow = (categoryIndex) => {
        const newCategories = [...categories];
        newCategories[categoryIndex].assignments.push({ assignment: "", grade: "", weight: "" });
        setCategories(newCategories);
    };

    const [classGrade, setClassGrade] = useState('');

    return (
        <div className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-screen w-screen">
            <div className="flex flex-col justify-center items-center">
                <motion.h1
                    className="pt-20 pb-10 font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    Enter the name and weight of each category, as well as the desired final grade in the class.
                </motion.h1>
                <h1 className="p-5 pr-6 pl-7 rounded-full text-xl text-nexus-blue-900 bg-gradient-to-b from-nexus-blue-200 via-white to-nexus-blue-200 text-center">
                    <strong>Grade Required:</strong><br />90%
                </h1>
                {/* grid of categories */}
                <div className="pl-2 pr-2 pt-6 grid grid-cols-2 gap-4 categories">
                    {categories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="rounded-tl-lg rounded-br-lg p-2 bg-nexus-blue-200 category">
                            <div className="flex flex-row items-center">
                                <label htmlFor={`category-${categoryIndex}`} className="pr-3 block text-sm font-medium text-nexus-blue-600">Category</label>
                                <input
                                    type="text"
                                    id={`category-${categoryIndex}`}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                    value={category.name}
                                    onChange={(e) => handleCategoryChange(categoryIndex, "name", e.target.value)}
                                    placeholder="Enter Category"
                                    required
                                />
                                <label htmlFor={`category-weight-${categoryIndex}`} className="pl-3 pr-3 block text-xs font-medium text-nexus-blue-600">Weight (%)</label>
                                <input
                                    type="number"
                                    id={`category-weight-${categoryIndex}`}
                                    className="mt-1 pr-0 pl-3 w-1/4 rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                    value={category.weight}
                                    onChange={(e) => handleCategoryChange(categoryIndex, "weight", e.target.value)}
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="pt-5 grid grid-cols-3 place-content-evenly">
                                <h1 className="text-nexus-blue-900">Assignment</h1>
                                <h1 className="text-nexus-blue-900">Grade (%)</h1>
                                <h1 className="text-nexus-blue-900">Weight (%)</h1>
                                {category.assignments.map((assignment, assignmentIndex) => (
                                    <React.Fragment key={assignmentIndex}>
                                        <input
                                            type="text"
                                            className="mt-1 text-xs w-5/6 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                            value={assignment.assignment}
                                            onChange={(e) => handleAssignmentChange(categoryIndex, assignmentIndex, "assignment", e.target.value)}
                                            placeholder="Enter Assignment"
                                            required
                                        />
                                        <input
                                            type="number"
                                            className="mt-1 text-xs w-5/6 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                            value={assignment.grade}
                                            onChange={(e) => handleAssignmentChange(categoryIndex, assignmentIndex, "grade", e.target.value)}
                                            placeholder="Enter Grade"
                                            required
                                        />
                                        <input
                                            type="number"
                                            className="mt-1 text-xs w-5/6 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                            value={assignment.weight}
                                            onChange={(e) => handleAssignmentChange(categoryIndex, assignmentIndex, "weight", e.target.value)}
                                            placeholder="Enter Weight"
                                            required
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className = "flex flex-row justify-around items-center">
                            <h1 className="pt-3 text-xl text-nexus-blue-900"><strong>Category Grade:</strong> 90%</h1>
                            <button
                                type="button"
                                onClick={() => addAssignmentRow(categoryIndex)}
                                className="mt-4 p-1 pr-2 pl-2 bg-nexus-blue-300 text-white text-xl font-bold rounded-md transition duration 300 transform hover:bg-nexus-blue-900"
                            >
                                +
                            </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-row justify-between items-center gap-4">
                    <div className="flex flex-col justify-start items-start gap-2">
                        <h1 className="pt-3 text-xl text-nexus-blue-200"><strong>Remaining Assignment Weight:</strong> 15</h1>
                        <div className="flex flex-row items-center">
                            <h1 className="pt-3 text-xl text-nexus-blue-200"><strong>Desired Class Grade:</strong></h1>
                            <input
                                type="number"
                                id="classGrade"
                                className="mt-1 ml-6 block w-1/6 rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                value={classGrade}
                                onChange={(e) => setClassGrade(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={addCategory}
                        className="mt-6 p-2 bg-nexus-blue-300 text-white font-bold rounded-md transition duration-300 hover:text-nexus-blue-900 transform hover:bg-nexus-blue-100"
                    >
                    Add Category
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GradeCalculator;
