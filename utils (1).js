/**
 * Calculates the average score for a student's most recent form.
 * Returns "No Data" if no performance records exist.
 */
function calculateLatestAverage(student) {
    if (!student.performance || student.performance.length === 0) {
        return "No Data";
    }

    // Get the most recent performance entry
    const latest = student.performance[student.performance.length - 1];
    
    // Use our helper to calculate the average of this specific record
    return calculateRecordAverage(latest) + "%";
}

/**
 * Helper: Calculates average for a single performance object
 * Used by both the main table and the history transcript.
 */
function calculateRecordAverage(record) {
    const scores = Object.values(record.subjects);
    const total = scores.reduce((sum, score) => sum + score, 0);
    return (total / scores.length).toFixed(1);
}

/**
 * Requirement 5.4: Calculate Status (PASS/FAIL)
 * Determines badge color and text based on the score.
 */
function getPassStatus(averageString) {
    if (averageString === "No Data") {
        return { text: "PENDING", color: "#7f8c8d" }; // Gray
    }
    
    const numericAvg = parseFloat(averageString);
    
    // Benchmark: 50% to pass
    if (numericAvg >= 50) {
        return { text: "PASS", color: "#27ae60" }; // Green
    } else {
        return { text: "FAIL", color: "#e74c3c" }; // Red
    }
}

/**
 * Validates Student ID format (e.g., S001)
 */
function isValidStudentID(id) {
    const regex = /^S\d{3,}$/i; 
    return regex.test(id);
}

/**
 * Determines a Letter Grade based on a score
 */
function getGrade(score) {
    if (score >= 75) return 'A';
    if (score >= 60) return 'B';
    if (score >= 45) return 'C';
    if (score >= 30) return 'D';
    return 'F';
}

/**
 * Formats current date
 */
function getCurrentDate() {
    return new Date().toLocaleDateString();
}