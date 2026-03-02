// --- 1. DOM Elements ---
const studentForm = document.getElementById('student-form');
const studentTableBody = document.getElementById('student-tbody');
const searchInput = document.getElementById('search-input');
const performanceModal = document.getElementById('performance-modal');
const viewModal = document.getElementById('view-modal');
const performanceForm = document.getElementById('performance-form');

// --- 2. Event Listeners ---

/**
 * Handle Student Registration
 * Connects to addStudent() in data.js
 */
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newStudent = {
        id: document.getElementById('student-id').value,
        name: document.getElementById('student-name').value,
        age: parseInt(document.getElementById('student-age').value),
        gender: document.getElementById('student-gender').value,
        form: parseInt(document.getElementById('student-form-level').value),
        performance: [] // Holds academic records for Form 1-4
    };

    if (addStudent(newStudent)) {
        studentForm.reset();
        refreshUI();
    }
});

/**
 * Handle Table Actions using Event Delegation
 * Ensures buttons for 'Marks', 'History', 'Promote', and 'Delete' function correctly.
 */
studentTableBody.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;
    
    if (!id) return;

    // Delete Student
    if (target.classList.contains('btn-danger')) {
        if (confirm("Delete this student permanently?")) {
            deleteStudent(id);
            refreshUI();
        }
    } 
    
    // Open Performance Modal (+ Marks)
    if (target.id === 'btn-add-marks') {
        openPerformanceModal(id);
    }

    // View Academic History (Transcript)
    if (target.id === 'btn-view-history') {
        viewStudentRecords(id);
    }

    // Promote to Next Form
    if (target.id === 'btn-promote') {
        promoteStudent(id); 
        refreshUI();
    }
});

/**
 * Handle Performance Form Submission (Requirement 5.4)
 */
performanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('target-student-id').value;
    
    const scores = {
        math: parseInt(document.getElementById('math-score').value),
        english: parseInt(document.getElementById('english-score').value),
        science: parseInt(document.getElementById('science-score').value),
        social: parseInt(document.getElementById('social-score').value)
    };

    addPerformance(id, scores);
    closeModal();
    refreshUI();
});

/**
 * Handle Real-time Search
 */
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term)
    );
    renderTable(filtered);
});

// --- 3. UI Functions ---

function refreshUI() {
    renderTable(students);
}

/**
 * Renders the main student dashboard table
 */
function renderTable(data) {
    studentTableBody.innerHTML = "";
    
    data.forEach(student => {
        const avg = calculateLatestAverage(student);
        const statusInfo = getPassStatus(avg); 
const row = `
    <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>Form ${student.form}</td>
        <td><strong>${avg}</strong></td>
        <td>
            <span style="color:white; background:${statusInfo.color}; padding:3px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">
                ${statusInfo.text}
            </span>
        </td>
        <td>
            <button class="btn-success btn-small" id="btn-add-marks" data-id="${student.id}">+ Marks</button>
            <button class="btn-info btn-small" id="btn-view-history" data-id="${student.id}">View Performance</button>
            <button class="btn-warning btn-small" id="btn-promote" data-id="${student.id}">Promote</button>
            <button class="btn-danger btn-small" data-id="${student.id}">Delete</button>
        </td>
    </tr>

        `;
        studentTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// --- 4. Modal Logic ---

function openPerformanceModal(id) {
    const student = students.find(s => s.id === id);
    document.getElementById('target-student-id').value = id;
    
    // Check if the student already has scores for the current form
    const currentRecord = student.performance.find(rec => rec.form === student.form);

    if (currentRecord) {
        // Fill the form with existing marks for updating
        document.getElementById('math-score').value = currentRecord.subjects.math;
        document.getElementById('english-score').value = currentRecord.subjects.english;
        document.getElementById('science-score').value = currentRecord.subjects.science;
        document.getElementById('social-score').value = currentRecord.subjects.social;
        document.getElementById('modal-title').innerText = `Update Results (Form ${student.form})`;
    } else {
        // Clear the form for a new entry
        performanceForm.reset();
        document.getElementById('modal-title').innerText = `Add Results (Form ${student.form})`;
    }

    performanceModal.style.display = 'block';
}

function closeModal() {
    performanceModal.style.display = 'none';
    performanceForm.reset();
}

/**
 * Displays the Academic Transcript Modal (Requirement 5.4)
 */
function viewStudentRecords(id) {
    const student = students.find(s => s.id === id);
    const content = document.getElementById('transcript-content');
    
    if (!student) return;

    let html = `<h2>Academic Performance Report: ${student.name}</h2>`;
    html += `<p><strong>ID:</strong> ${student.id} | <strong>Level:</strong> Form ${student.form}</p>`;
    
    if (student.performance.length === 0) {
        html += `<div class="card" style="text-align:center; padding:20px;">No academic records found. Add marks to see history.</div>`;
    } else {
        html += `<table>
                    <thead>
                        <tr><th>Level</th><th>Math</th><th>Eng</th><th>Sci</th><th>Soc</th><th>Average</th></tr>
                    </thead>
                    <tbody>`;
        
        student.performance.forEach(rec => {
            const sum = rec.subjects.math + rec.subjects.english + rec.subjects.science + rec.subjects.social;
            const rowAvg = (sum / 4).toFixed(1);
            html += `<tr>
                <td>Form ${rec.form}</td>
                <td>${rec.subjects.math}</td>
                <td>${rec.subjects.english}</td>
                <td>${rec.subjects.science}</td>
                <td>${rec.subjects.social}</td>
                <td><strong>${rowAvg}%</strong></td>
            </tr>`;
        });
        html += `</tbody></table>`;
    }
    content.innerHTML = html;
    viewModal.style.display = 'block';
}

function closeViewModal() {
    viewModal.style.display = 'none';
}

// Handle clicks outside of modals to close them
window.onclick = (e) => { 
    if (e.target == performanceModal) closeModal(); 
    if (e.target == viewModal) closeViewModal();
};

// --- 5. Initial Execution ---
refreshUI();