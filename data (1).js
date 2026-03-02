/**
 * Global Student State
 * Loads from LocalStorage on startup, or defaults to an empty array.
 */
let students = JSON.parse(localStorage.getItem('studentManagementData')) || [];

/**
 * Persist Data: Saves the current students array to LocalStorage.
 * Call this after any change (Create, Update, Delete).
 */
function saveToLocalStorage() {
    localStorage.setItem('studentManagementData', JSON.stringify(students));
}

/**
 * Create: Add a new student
 */
function addStudent(studentObj) {
    const exists = students.some(s => s.id === studentObj.id);
    
    if (exists) {
        alert("Error: A student with this ID already exists.");
        return false;
    }

    students.push(studentObj);
    saveToLocalStorage(); // PERSIST
    return true;
}

/**
 * Delete: Remove a student
 */
function deleteStudent(studentId) {
    students = students.filter(student => student.id !== studentId);
    saveToLocalStorage(); // PERSIST
}

/**
 * Update/Add: Academic performance (Requirement 5.4)
 * Now checks if the student already has marks for their current Form.
 * If yes, it UPDATES them. If no, it ADDS a new record.
 */
function addPerformance(studentId, subjectScores) {
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        // Find if a record for the CURRENT form already exists
        const existingRecord = student.performance.find(rec => rec.form === student.form);

        if (existingRecord) {
            // UPDATE: Overwrite existing scores
            existingRecord.subjects = {
                math: subjectScores.math,
                english: subjectScores.english,
                science: subjectScores.science,
                social: subjectScores.social
            };
            alert(`Results UPDATED for ${student.name} (Form ${student.form})`);
        } else {
            // ADD: Create a new record for this form
            const newRecord = {
                form: student.form,
                subjects: {
                    math: subjectScores.math,
                    english: subjectScores.english,
                    science: subjectScores.science,
                    social: subjectScores.social
                }
            };
            student.performance.push(newRecord);
            alert(`Results ADDED for ${student.name} (Form ${student.form})`);
        }

        saveToLocalStorage(); // Keep data safe
    }
}
/**
 * Logic: Promote a student to the next form
 */
function promoteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        if (student.form < 4) {
            student.form += 1;
            saveToLocalStorage(); // PERSIST
            alert(`${student.name} promoted to Form ${student.form}`);
            return true;
        } else {
            alert("Student has already completed Form 4 (O-Level Graduate).");
            return false;
        }
    }
    return false;
}

/**
 * System Reset: Clears all data (Useful for testing)
 */
function clearAllData() {
    if (confirm("Warning: This will delete ALL student records permanently.")) {
        students = [];
        localStorage.removeItem('studentManagementData');
        location.reload(); // Refresh page to clear UI
    }
}