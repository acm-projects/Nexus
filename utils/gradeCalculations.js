
function calculateFinalGrade(grades) {
  
  let totalWeightedGrades = 0
  let totalWeight = 0

  grades.forEach(grade => {
    const { name, weight, average } = grade

    totalWeightedGrades += (weight / 100) * average
    totalWeight += weight
  })

  if (totalWeight !== 100) {
    throw new Error('Total weight cannot be more than 100%')
  }
  return totalWeightedGrades
}

export default calculateFinalGrade;