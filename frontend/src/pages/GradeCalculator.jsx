import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const GradeCalculator = () => {
    const [categories, setCategories] = useState([
        { name: "", weight: "", assignments: [{ assignment: "", grade: "", weight: "" }] }
    ]);
    const [classGrade, setClassGrade] = useState('');
    const [overallGrade, setOverallGrade] = useState(0);
    const [remainingWeight, setRemainingWeight] = useState(100);
    const [userId, setUserId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courses, setCourses] = useState([]);
    const [categoryGrades, setCategoryGrades] = useState([]);
    const [requiredGrade, setRequiredGrade] = useState(null);

    // Fetch user's courses on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/gradeCalculator/getCourses', {
                    params: { userId }
                });
                setCourses(response.data.courseIds);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        if (userId) {
            fetchCourses();
        }
    }, [userId]);

    useEffect(() => {
        // Existing calculations
        const totalWeight = categories.reduce((sum, category) => {
            return sum + (parseFloat(category.weight) || 0);
        }, 0);
        setRemainingWeight(100 - totalWeight);
       
        // Calculate overall grade
        const currentGrade = calculateOverallGrade();
    
        // Calculate required grade if user has entered a desired grade
        if (classGrade) {
            const required = calculateRequiredGrade(
                parseFloat(currentGrade), 
                remainingWeight,
                parseFloat(classGrade)
            );
            setRequiredGrade(required);
        }
    
        categories.forEach((category, index) => {
            const grade = calculateCategoryGrade(category, index);
            updateCategoryGrade(index, grade);
        });
    }, [categories, classGrade]); 

    const updateCategoryGrade = (index, grade) => {
        setCategoryGrades(prevGrades => {
            const newGrades = [...prevGrades];
            newGrades[index] = grade !== 'N/A' ? `${grade}%` : 'N/A';
            return newGrades;
        });
    };


    const calculateCategoryGrade = (category, index) => {
        const assignments = category.assignments.filter(a => 
            a.grade !== "" && a.weight !== "" && 
            !isNaN(parseFloat(a.grade)) && !isNaN(parseFloat(a.weight))
        );
        
        if (assignments.length === 0) return 'N/A';

        let totalWeightedGrade = 0;
        let totalWeight = 0;

        assignments.forEach(assignment => {
            const grade = parseFloat(assignment.grade);
            const weight = parseFloat(assignment.weight);
            totalWeightedGrade += (grade * weight);
            totalWeight += weight;
        });

        return totalWeight > 0 ? (totalWeightedGrade / totalWeight).toFixed(2) : 'N/A';
    };

    const calculateRequiredGrade = (currentWeightedGrade, remainingWeight, desiredGrade) => {
        // If there's no remaining weight, return null as it's impossible to change the grade
        if (remainingWeight <= 0) return null;
        
        // Convert everything to decimals for calculation
        const currentWeight = 100 - remainingWeight;
        const currentWeightDecimal = currentWeight / 100;
        const remainingWeightDecimal = remainingWeight / 100;
    
        const requiredGrade = (desiredGrade - (currentWeightedGrade * currentWeightDecimal)) / remainingWeightDecimal;
        
        // Return null if the required grade is impossible (> 100 or < 0)
        if (requiredGrade > 100 || requiredGrade < 0) return null;
        
        return requiredGrade.toFixed(2);
      };

    const calculateOverallGrade = () => {
        let totalWeightedGrade = 0;
        let totalWeight = 0;

        categories.forEach(category => {
            const categoryWeight = parseFloat(category.weight) || 0;
            const assignments = category.assignments.filter(a => a.grade && a.weight);
           
            if (assignments.length > 0) {
                let categoryGrade = 0;
                let assignmentWeightSum = 0;
               
                assignments.forEach(assignment => {
                    const grade = parseFloat(assignment.grade);
                    const weight = parseFloat(assignment.weight);
                    categoryGrade += (grade * weight);
                    assignmentWeightSum += weight;
                });

                if (assignmentWeightSum > 0) {
                    categoryGrade = categoryGrade / assignmentWeightSum;
                    totalWeightedGrade += (categoryGrade * (categoryWeight / 100));
                    totalWeight += categoryWeight;
                }
            }
        });

        const calculatedGrade = totalWeightedGrade.toFixed(2);
        setOverallGrade(calculatedGrade);
        return calculatedGrade;
    };

    const saveCategoryGrade = async (categoryName, categoryGrade) => {
        try {
            await axios.post('http://localhost:3000/api/gradeCalculator/addCategory', {
                userId,
                courseId,
                categoryName,
                categoryWeight: categories.find(c => c.name === categoryName)?.weight || 0,
                categoryGrade
            });
        } catch (error) {
            console.error('Error saving category grade:', error);
        }
    };

    const handleCategoryChange = async (index, field, value) => {
        const newCategories = [...categories];
        newCategories[index][field] = value;
        setCategories(newCategories);

        if (field === 'name' || field === 'weight') {
            try {
                await axios.post('http://localhost:3000/api/gradeCalculator/addCategory', {
                    userId,
                    courseId,
                    categoryName: newCategories[index].name,
                    categoryWeight: newCategories[index].weight
                });
            } catch (error) {
                console.error('Error saving category:', error);
            }
        }
    };

    const handleAssignmentChange = async (categoryIndex, assignmentIndex, field, value) => {
        const newCategories = [...categories];
        newCategories[categoryIndex].assignments[assignmentIndex][field] = value;
        setCategories(newCategories);
    
        if (field === 'grade' || field === 'weight') {
            try {
                const assignment = newCategories[categoryIndex].assignments[assignmentIndex];
                await axios.post('http://localhost:3000/api/gradeCalculator/addAssignment', {
                    userId,
                    courseId,
                    categoryName: newCategories[categoryIndex].name,
                    assignmentName: assignment.assignment,
                    score: assignment.grade,
                    weight: assignment.weight
                });
    
                // Recalculate and save category grade
                const categoryGrade = calculateCategoryGrade(newCategories[categoryIndex], categoryIndex);
                await saveCategoryGrade(newCategories[categoryIndex].name, categoryGrade);
            } catch (error) {
                console.error('Error saving assignment:', error);
            }
        }
    };    

    const saveGrades = async () => {
        try {
            // First, save all category grades
            await Promise.all(categories.map(category => {
                const categoryGrade = calculateCategoryGrade(category);
                return saveCategoryGrade(category.name, categoryGrade);
            }));

            // Then calculate and save overall grade
            const finalGrade = calculateOverallGrade();
            const response = await axios.get('http://localhost:3000/api/gradeCalculator/calculateGrade', {
                params: { userId, courseId }
            });

            setOverallGrade(response.data.overallGrade);
            
            // Update the overall grade in the database
            await axios.post('http://localhost:3000/api/gradeCalculator/updateOverallGrade', {
                userId,
                courseId,
                overallGrade: finalGrade
            });
        } catch (error) {
            console.error('Error saving grades:', error);
        }
    };

    const addCategory = () => {
        setCategories([...categories, { name: "", weight: "", assignments: [{ assignment: "", grade: "", weight: "" }] }]);
    };

    const addAssignmentRow = (categoryIndex) => {
        const newCategories = [...categories];
        newCategories[categoryIndex].assignments.push({ assignment: "", grade: "", weight: "" });
        setCategories(newCategories);
    };

    return (
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-dvh w-screen">
            <div className="flex flex-col justify-center items-center">
                <motion.h1
                    className="mt-4 pt-20 pb-10 font-bold text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Enter the name and weight of each category, as well as the desired final grade in the class.
                    <br />
                    Press "Save" to save your inputs to a class.
                </motion.h1>
                <motion.h1 
                    className="p-5 pr-6 pl-7 rounded-md text-xl text-white text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                >
                    <strong>Grade Required on Remaining Work:</strong><br />
                    {requiredGrade === null ? 
                        "Not possible with current grades" : 
                        `${requiredGrade}%`
                    }
                </motion.h1>
                {/* grid of categories */}
                <motion.div 
                    className="mb-6 px-2 pt-6 grid grid-cols-2 gap-6 categories"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                >
                    {categories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="rounded-lg p-6 bg-black bg-opacity-30 border-2 border-nexus-blue-400 category">
                            <div className="flex flex-row items-center">
                                <label htmlFor={`category-${categoryIndex}`} className="pr-3 block text-sm font-medium text-white">Category</label>
                                <input
                                    type="text"
                                    id={`category-${categoryIndex}`}
                                    className="mt-1 text-black text-sm block w-full rounded-md bg-nexus-blue-50 border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 p-1"
                                    value={category.name}
                                    onChange={(e) => handleCategoryChange(categoryIndex, "name", e.target.value)}
                                    placeholder="Enter Category"
                                    required
                                />
                                <label htmlFor={`category-weight-${categoryIndex}`} className="pl-3 pr-3 block text-xs font-medium text-white">Weight (%)</label>
                                <input
                                    type="number"
                                    id={`category-weight-${categoryIndex}`}
                                    className="mt-1 pr-0 pl-3 w-1/4 text-black rounded-md bg-nexus-blue-50 border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 p-1"
                                    value={category.weight}
                                    onChange={(e) => handleCategoryChange(categoryIndex, "weight", e.target.value)}
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="pt-5 grid grid-cols-3 gap-x-4 gap-y-2 place-content-evenly">
                                <h1 className="text-white">Assignment</h1>
                                <h1 className="text-white">Grade Earned (Points)</h1>
                                <h1 className="text-white">Points Possible </h1>
                                {category.assignments.map((assignment, assignmentIndex) => (
                                    <React.Fragment key={assignmentIndex}>
                                        <input
                                            type="text"
                                            className="mt-1 text-xs h-8 w-5/6 block w-full rounded-md bg-nexus-blue-50 border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                            value={assignment.assignment}
                                            onChange={(e) => handleAssignmentChange(categoryIndex, assignmentIndex, "assignment", e.target.value)}
                                            placeholder="Name"
                                            required
                                        />
                                        <input
                                            type="number"
                                            className="mt-1 text-xs h-8 w-5/6 block w-full rounded-md bg-nexus-blue-50 border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                            value={assignment.grade}
                                            onChange={(e) => handleAssignmentChange(categoryIndex, assignmentIndex, "grade", e.target.value)}
                                            placeholder="Grade Earned"
                                            required
                                        />
                                        <input
                                            type="number"
                                            className="mt-1 text-xs h-8 w-5/6 block w-full rounded-md bg-nexus-blue-50 border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                                            value={assignment.weight}
                                            onChange={(e) => handleAssignmentChange(categoryIndex, assignmentIndex, "weight", e.target.value)}
                                            placeholder="Points Possible"
                                            required
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className = "flex flex-row justify-around items-center">
                            <h1 className="pt-3 text-xl text-white"><strong>Category Grade:</strong> {categoryGrades[categoryIndex] || 'N/A'}</h1>
                            <button
                                type="button"
                                onClick={() => addAssignmentRow(categoryIndex)}
                                className="mt-4 p-1 pr-2 pl-2 bg-nexus-blue-300 text-white text-xl font-bold rounded-md transition duration 300 transform hover:text-nexus-blue-900 transform hover:bg-nexus-blue-100"
                            >
                                +
                            </button>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div 
                    className="mb-4 flex flex-col justify-center items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                >
                    <div className="flex flex-row justify-center items-center gap-8">
                        <h1 className="text-xl text-nexus-blue-200"><strong>Current Grade: </strong> {overallGrade}%</h1>
                        <h1 className="text-xl text-nexus-blue-200"><strong>Remaining Assignment Weight:</strong> {remainingWeight}%</h1>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl text-nexus-blue-200"><strong>Desired Class Grade:</strong></h1>
                        <input
                            type="number"
                            id="classGrade"
                            className="mt-1 block w-1/6 bg-nexus-blue-50 rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1"
                            value={classGrade}
                            onChange={(e) => setClassGrade(e.target.value)}
                            required
                        />
                    </div>
                </motion.div>


            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className = "fixed bottom-6 right-8"
            >
                <button
                        type="button"
                        onClick={addCategory}
                        className="mt-6 mr-4 p-2 bg-nexus-blue-300 text-white font-bold rounded-md transition duration-300 hover:text-nexus-blue-900 transform hover:bg-nexus-blue-100"
                    >
                    Add Category
                </button>
                <button 
                className = "px-6 py-2 bg-nexus-blue-300 text-white font-bold rounded-md transition duration-300 hover:text-nexus-blue-900 transform hover:bg-nexus-blue-100"
                onClick={saveGrades}
                >
                Save
                </button>
            </motion.div>
        </div>
    );
};

export default GradeCalculator;