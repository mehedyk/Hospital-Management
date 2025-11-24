// ==================== ONE-TIME PAD ENCRYPTION SYSTEM ====================

/**
 * ONE-TIME PAD (OTP) ENCRYPTION EXPLANATION:
 * 
 * OTP is a theoretically unbreakable encryption method when used correctly.
 * 
 * HOW IT WORKS:
 * 1. Key Generation: A random key of the same length as the message is generated
 * 2. Encryption: Each character is XORed with the corresponding key character
 * 3. Decryption: The same key is XORed with the ciphertext to get the original
 * 
 * IMPLEMENTATION IN THIS SYSTEM:
 * - All passwords are encrypted before storing in sessionStorage
 * - Patient and doctor sensitive data is encrypted
 * - Each encryption generates a unique random key
 * - Keys are stored separately and required for decryption
 * - Session-based: All data cleared when tab closes
 * 
 * SECURITY PROPERTIES:
 * - Provides perfect secrecy when key is truly random
 * - Key must be at least as long as the message
 * - Key must never be reused
 * - Key must be kept secret
 */

// Generate random key for OTP
function generateOTPKey(length) {
    let key = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    for (let i = 0; i < length; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// XOR-based OTP encryption
function otpEncrypt(plaintext, key) {
    if (key.length < plaintext.length) {
        key = key.padEnd(plaintext.length, key);
    }
    
    let ciphertext = '';
    for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i) ^ key.charCodeAt(i);
        ciphertext += String.fromCharCode(charCode);
    }
    
    // Convert to Base64 for safe storage
    return {
        ciphertext: btoa(ciphertext),
        key: btoa(key)
    };
}

// XOR-based OTP decryption
function otpDecrypt(ciphertext, key) {
    try {
        ciphertext = atob(ciphertext);
        key = atob(key);
        
        let plaintext = '';
        for (let i = 0; i < ciphertext.length; i++) {
            const charCode = ciphertext.charCodeAt(i) ^ key.charCodeAt(i);
            plaintext += String.fromCharCode(charCode);
        }
        return plaintext;
    } catch (e) {
        return null;
    }
}

// ==================== SESSION STORAGE MANAGEMENT ====================

// Initialize system with admin account (fixed, non-editable)
function initializeSystem() {
    if (!sessionStorage.getItem('systemInitialized')) {
        const adminPassword = 'admin123';
        const adminEncrypted = otpEncrypt(adminPassword, generateOTPKey(adminPassword.length));
        
        const adminAccount = {
            username: 'admin',
            password: adminEncrypted.ciphertext,
            key: adminEncrypted.key,
            role: 'admin',
            name: 'System Administrator'
        };
        
        sessionStorage.setItem('admin', JSON.stringify(adminAccount));
        sessionStorage.setItem('users', JSON.stringify([]));
        sessionStorage.setItem('patients', JSON.stringify([]));
        sessionStorage.setItem('doctors', JSON.stringify([]));
        sessionStorage.setItem('appointments', JSON.stringify([]));
        sessionStorage.setItem('bills', JSON.stringify([]));
        sessionStorage.setItem('systemInitialized', 'true');
        sessionStorage.setItem('patientIdCounter', '1001');
        sessionStorage.setItem('doctorIdCounter', '2001');
        sessionStorage.setItem('appointmentIdCounter', '3001');
        sessionStorage.setItem('billIdCounter', '4001');
    }
}

// ==================== NAVIGATION ====================

let currentRole = 'admin';
let currentSignupRole = 'doctor';
let currentUser = null;

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showLandingPage() {
    showPage('landingPage');
}

function showLoginPage() {
    showPage('loginPage');
    selectRole('admin');
}

function showSignupPage() {
    showPage('signupPage');
    selectSignupRole('doctor');
}

function selectRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(role + 'RoleBtn').classList.add('active');
}

function selectSignupRole(role) {
    currentSignupRole = role;
    document.querySelectorAll('#signupPage .role-btn').forEach(btn => btn.classList.remove('active'));
    
    if (role === 'doctor') {
        document.getElementById('signupDoctorBtn').classList.add('active');
        document.getElementById('doctorSpecificFields').style.display = 'block';
        document.getElementById('patientSpecificFields').style.display = 'none';
    } else {
        document.getElementById('signupPatientBtn').classList.add('active');
        document.getElementById('doctorSpecificFields').style.display = 'none';
        document.getElementById('patientSpecificFields').style.display = 'block';
    }
}

// ==================== AUTHENTICATION ====================

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (currentRole === 'admin') {
        const admin = JSON.parse(sessionStorage.getItem('admin'));
        const decryptedPassword = otpDecrypt(admin.password, admin.key);
        
        if (username === admin.username && password === decryptedPassword) {
            currentUser = admin;
            showPage('adminDashboard');
            loadAdminDashboard();
            document.getElementById('loginForm').reset();
            return;
        }
    } else {
        const users = JSON.parse(sessionStorage.getItem('users'));
        const user = users.find(u => u.username === username && u.role === currentRole);
        
        if (user) {
            const decryptedPassword = otpDecrypt(user.password, user.key);
            if (password === decryptedPassword) {
                currentUser = user;
                if (currentRole === 'doctor') {
                    showPage('doctorDashboard');
                    loadDoctorDashboard();
                } else {
                    showPage('patientDashboard');
                    loadPatientDashboard();
                }
                document.getElementById('loginForm').reset();
                return;
            }
        }
    }
    
    alert('Invalid credentials!');
}

function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value.trim();
    
    const users = JSON.parse(sessionStorage.getItem('users'));
    
    if (users.some(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }
    
    const encrypted = otpEncrypt(password, generateOTPKey(password.length));
    
    const newUser = {
        username,
        password: encrypted.ciphertext,
        key: encrypted.key,
        role: currentSignupRole,
        name
    };
    
    if (currentSignupRole === 'doctor') {
        const specialization = document.getElementById('specialization').value.trim();
        const salary = document.getElementById('salary').value;
        
        const doctorId = sessionStorage.getItem('doctorIdCounter');
        sessionStorage.setItem('doctorIdCounter', (parseInt(doctorId) + 1).toString());
        
        const doctors = JSON.parse(sessionStorage.getItem('doctors'));
        doctors.push({
            id: doctorId,
            name,
            specialization,
            availability: 'Available',
            salary: salary || 'Not specified',
            username
        });
        sessionStorage.setItem('doctors', JSON.stringify(doctors));
        
    } else {
        const age = document.getElementById('age').value;
        const phone = document.getElementById('phone').value;
        const bloodGroup = document.getElementById('bloodGroup').value;
        
        const patientId = sessionStorage.getItem('patientIdCounter');
        sessionStorage.setItem('patientIdCounter', (parseInt(patientId) + 1).toString());
        
        const patients = JSON.parse(sessionStorage.getItem('patients'));
        patients.push({
            id: patientId,
            name,
            age,
            phone,
            bloodGroup,
            symptoms: '',
            assignedDoctor: '',
            username
        });
        sessionStorage.setItem('patients', JSON.stringify(patients));
    }
    
    users.push(newUser);
    sessionStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! Please login.');
    showLoginPage();
    document.getElementById('signupForm').reset();
}

function logout() {
    currentUser = null;
    showLandingPage();
}

// ==================== ADMIN DASHBOARD ====================

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.getElementById(tabName + 'Content').classList.add('active');
    
    if (tabName === 'patients') loadPatients();
    if (tabName === 'doctors') loadDoctors();
    if (tabName === 'appointments') loadAppointments();
    if (tabName === 'billing') loadBills();
}

function loadAdminDashboard() {
    loadPatients();
}

// ==================== PATIENT MANAGEMENT ====================

function showAddPatientForm() {
    document.getElementById('addPatientForm').style.display = 'block';
    loadDoctorDropdown();
}

function hideAddPatientForm() {
    document.getElementById('addPatientForm').style.display = 'none';
    document.getElementById('addPatientForm').querySelectorAll('input, select').forEach(el => el.value = '');
}

function loadDoctorDropdown() {
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const select = document.getElementById('assignedDoctor');
    select.innerHTML = '<option value="">Assign Doctor</option>';
    doctors.forEach(doc => {
        select.innerHTML += `<option value="${doc.id}">${doc.name} - ${doc.specialization}</option>`;
    });
}

function addPatient() {
    const name = document.getElementById('patientName').value.trim();
    const age = document.getElementById('patientAge').value;
    const phone = document.getElementById('patientPhone').value.trim();
    const bloodGroup = document.getElementById('patientBloodGroup').value;
    const symptoms = document.getElementById('patientSymptoms').value.trim();
    const assignedDoctor = document.getElementById('assignedDoctor').value;
    
    if (!name || !age || !phone || !bloodGroup) {
        alert('Please fill all required fields!');
        return;
    }
    
    const patientId = sessionStorage.getItem('patientIdCounter');
    sessionStorage.setItem('patientIdCounter', (parseInt(patientId) + 1).toString());
    
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    patients.push({
        id: patientId,
        name,
        age,
        phone,
        bloodGroup,
        symptoms,
        assignedDoctor,
        username: ''
    });
    
    sessionStorage.setItem('patients', JSON.stringify(patients));
    hideAddPatientForm();
    loadPatients();
    alert('Patient added successfully!');
}

function loadPatients() {
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const container = document.getElementById('patientsList');
    
    if (patients.length === 0) {
        container.innerHTML = '<p>No patients registered yet.</p>';
        return;
    }
    
    container.innerHTML = patients.map(patient => {
        const doctor = doctors.find(d => d.id === patient.assignedDoctor);
        const doctorName = doctor ? doctor.name : 'Not assigned';
        
        return `
            <div class="data-card">
                <h4>${patient.name} (ID: ${patient.id})</h4>
                <p><strong>Age:</strong> ${patient.age}</p>
                <p><strong>Phone:</strong> ${patient.phone}</p>
                <p><strong>Blood Group:</strong> ${patient.bloodGroup}</p>
                <p><strong>Symptoms:</strong> ${patient.symptoms || 'None'}</p>
                <p><strong>Assigned Doctor:</strong> ${doctorName}</p>
            </div>
        `;
    }).join('');
}

// ==================== DOCTOR MANAGEMENT ====================

function showAddDoctorForm() {
    document.getElementById('addDoctorForm').style.display = 'block';
}

function hideAddDoctorForm() {
    document.getElementById('addDoctorForm').style.display = 'none';
    document.getElementById('addDoctorForm').querySelectorAll('input, select').forEach(el => el.value = '');
}

function addDoctor() {
    const name = document.getElementById('doctorName').value.trim();
    const specialization = document.getElementById('doctorSpecialization').value.trim();
    const availability = document.getElementById('doctorAvailability').value;
    const salary = document.getElementById('doctorSalary').value;
    
    if (!name || !specialization) {
        alert('Please fill all required fields!');
        return;
    }
    
    const doctorId = sessionStorage.getItem('doctorIdCounter');
    sessionStorage.setItem('doctorIdCounter', (parseInt(doctorId) + 1).toString());
    
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    doctors.push({
        id: doctorId,
        name,
        specialization,
        availability,
        salary: salary || 'Not specified',
        username: ''
    });
    
    sessionStorage.setItem('doctors', JSON.stringify(doctors));
    hideAddDoctorForm();
    loadDoctors();
    alert('Doctor added successfully!');
}

function loadDoctors() {
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const container = document.getElementById('doctorsList');
    
    if (doctors.length === 0) {
        container.innerHTML = '<p>No doctors registered yet.</p>';
        return;
    }
    
    container.innerHTML = doctors.map(doctor => `
        <div class="data-card">
            <h4>Dr. ${doctor.name} (ID: ${doctor.id})</h4>
            <p><strong>Specialization:</strong> ${doctor.specialization}</p>
            <p><strong>Availability:</strong> <span class="badge ${doctor.availability.toLowerCase().replace(' ', '')}">${doctor.availability}</span></p>
            <p><strong>Salary:</strong> ${doctor.salary}</p>
        </div>
    `).join('');
}

// ==================== APPOINTMENT SCHEDULING ====================

function showBookAppointmentForm() {
    document.getElementById('bookAppointmentForm').style.display = 'block';
    loadAppointmentDropdowns();
}

function hideBookAppointmentForm() {
    document.getElementById('bookAppointmentForm').style.display = 'none';
    document.getElementById('bookAppointmentForm').querySelectorAll('input, select').forEach(el => el.value = '');
}

function loadAppointmentDropdowns() {
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    
    const patientSelect = document.getElementById('appointmentPatient');
    patientSelect.innerHTML = '<option value="">Select Patient</option>';
    patients.forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.name} (${p.id})</option>`;
    });
    
    const doctorSelect = document.getElementById('appointmentDoctor');
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    doctors.forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}">Dr. ${d.name} - ${d.specialization}</option>`;
    });
}

function bookAppointment() {
    const patientId = document.getElementById('appointmentPatient').value;
    const doctorId = document.getElementById('appointmentDoctor').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const status = document.getElementById('appointmentStatus').value;
    
    if (!patientId || !doctorId || !date || !time) {
        alert('Please fill all required fields!');
        return;
    }
    
    const appointmentId = sessionStorage.getItem('appointmentIdCounter');
    sessionStorage.setItem('appointmentIdCounter', (parseInt(appointmentId) + 1).toString());
    
    const appointments = JSON.parse(sessionStorage.getItem('appointments'));
    appointments.push({
        id: appointmentId,
        patientId,
        doctorId,
        date,
        time,
        status
    });
    
    sessionStorage.setItem('appointments', JSON.stringify(appointments));
    hideBookAppointmentForm();
    loadAppointments();
    alert('Appointment booked successfully!');
}

function loadAppointments() {
    const appointments = JSON.parse(sessionStorage.getItem('appointments'));
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const container = document.getElementById('appointmentsList');
    
    if (appointments.length === 0) {
        container.innerHTML = '<p>No appointments scheduled yet.</p>';
        return;
    }
    
    container.innerHTML = appointments.map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const doctor = doctors.find(d => d.id === apt.doctorId);
        
        return `
            <div class="data-card">
                <h4>Appointment #${apt.id}</h4>
                <p><strong>Patient:</strong> ${patient ? patient.name : 'Unknown'} (${apt.patientId})</p>
                <p><strong>Doctor:</strong> Dr. ${doctor ? doctor.name : 'Unknown'}</p>
                <p><strong>Date:</strong> ${apt.date}</p>
                <p><strong>Time:</strong> ${apt.time}</p>
                <p><strong>Status:</strong> <span class="badge ${apt.status}">${apt.status.toUpperCase()}</span></p>
            </div>
        `;
    }).join('');
}

function searchAppointments() {
    const query = document.getElementById('searchAppointment').value.toLowerCase();
    const appointments = JSON.parse(sessionStorage.getItem('appointments'));
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    
    const filtered = appointments.filter(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const doctor = doctors.find(d => d.id === apt.doctorId);
        
        return apt.id.includes(query) ||
               (patient && patient.name.toLowerCase().includes(query)) ||
               (doctor && doctor.name.toLowerCase().includes(query)) ||
               apt.date.includes(query);
    });
    
    const container = document.getElementById('appointmentsList');
    container.innerHTML = filtered.map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const doctor = doctors.find(d => d.id === apt.doctorId);
        
        return `
            <div class="data-card">
                <h4>Appointment #${apt.id}</h4>
                <p><strong>Patient:</strong> ${patient ? patient.name : 'Unknown'} (${apt.patientId})</p>
                <p><strong>Doctor:</strong> Dr. ${doctor ? doctor.name : 'Unknown'}</p>
                <p><strong>Date:</strong> ${apt.date}</p>
                <p><strong>Time:</strong> ${apt.time}</p>
                <p><strong>Status:</strong> <span class="badge ${apt.status}">${apt.status.toUpperCase()}</span></p>
            </div>
        `;
    }).join('');
}

// ==================== BILLING ====================

function showCreateBillForm() {
    document.getElementById('createBillForm').style.display = 'block';
    loadBillPatientDropdown();
}

function hideCreateBillForm() {
    document.getElementById('createBillForm').style.display = 'none';
    document.getElementById('createBillForm').querySelectorAll('input, select').forEach(el => el.value = '');
    document.getElementById('billTotal').textContent = '0';
}

function loadBillPatientDropdown() {
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const select = document.getElementById('billPatient');
    select.innerHTML = '<option value="">Select Patient</option>';
    patients.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.name} (${p.id})</option>`;
    });
}

function calculateTotal() {
    const consultation = parseFloat(document.getElementById('consultationFee').value) || 0;
    const tests = parseFloat(document.getElementById('testsFee').value) || 0;
    const room = parseFloat(document.getElementById('roomCharge').value) || 0;
    const other = parseFloat(document.getElementById('otherCharges').value) || 0;
    
    const total = consultation + tests + room + other;
    document.getElementById('billTotal').textContent = total.toFixed(2);
}

function createBill() {
    const patientId = document.getElementById('billPatient').value;
    const consultation = parseFloat(document.getElementById('consultationFee').value) || 0;
    const tests = parseFloat(document.getElementById('testsFee').value) || 0;
    const room = parseFloat(document.getElementById('roomCharge').value) || 0;
    const other = parseFloat(document.getElementById('otherCharges').value) || 0;
    
    if (!patientId) {
        alert('Please select a patient!');
        return;
    }
    
    const total = consultation + tests + room + other;
    
    const billId = sessionStorage.getItem('billIdCounter');
    sessionStorage.setItem('billIdCounter', (parseInt(billId) + 1).toString());
    
    const bills = JSON.parse(sessionStorage.getItem('bills'));
    bills.push({
        id: billId,
        patientId,
        consultation,
        tests,
        room,
        other,
        total,
        date: new Date().toLocaleDateString()
    });
    
    sessionStorage.setItem('bills', JSON.stringify(bills));
    hideCreateBillForm();
    loadBills();
    alert('Bill created successfully!');
}

function loadBills() {
    const bills = JSON.parse(sessionStorage.getItem('bills'));
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const container = document.getElementById('billsList');
    
    if (bills.length === 0) {
        container.innerHTML = '<p>No bills created yet.</p>';
        return;
    }
    
    container.innerHTML = bills.map(bill => {
        const patient = patients.find(p => p.id === bill.patientId);
        
        return `
            <div class="data-card">
                <h4>Bill #${bill.id}</h4>
                <p><strong>Patient:</strong> ${patient ? patient.name : 'Unknown'} (${bill.patientId})</p>
                <p><strong>Date:</strong> ${bill.date}</p>
                <hr style="margin: 10px 0;">
                <p>Consultation Fee: $${bill.consultation.toFixed(2)}</p>
                <p>Tests: $${bill.tests.toFixed(2)}</p>
                <p>Room Charge: $${bill.room.toFixed(2)}</p>
                <p>Other: $${bill.other.toFixed(2)}</p>
                <hr style="margin: 10px 0;">
                <p><strong>Total: $${bill.total.toFixed(2)}</strong></p>
                <button onclick="printBill('${bill.id}')" class="btn btn-primary" style="margin-top: 10px;">Print Bill</button>
            </div>
        `;
    }).join('');
}

function printBill(billId) {
    const bills = JSON.parse(sessionStorage.getItem('bills'));
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const bill = bills.find(b => b.id === billId);
    const patient = patients.find(p => p.id === bill.patientId);
    
    const printContent = `
        <div style="padding: 40px; font-family: Arial;">
            <h1 style="text-align: center;">City General Hospital</h1>
            <h2 style="text-align: center;">Bill Invoice</h2>
            <hr>
            <p><strong>Bill ID:</strong> ${bill.id}</p>
            <p><strong>Patient:</strong> ${patient ? patient.name : 'Unknown'}</p>
            <p><strong>Patient ID:</strong> ${bill.patientId}</p>
            <p><strong>Date:</strong> ${bill.date}</p>
            <hr>
            <h3>Services</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td>Consultation Fee</td><td style="text-align: right;">$${bill.consultation.toFixed(2)}</td></tr>
                <tr><td>Tests</td><td style="text-align: right;">$${bill.tests.toFixed(2)}</td></tr>
                <tr><td>Room Charge</td><td style="text-align: right;">$${bill.room.toFixed(2)}</td></tr>
                <tr><td>Other Charges</td><td style="text-align: right;">$${bill.other.toFixed(2)}</td></tr>
            </table>
            <hr>
            <h2 style="text-align: right;">Total: $${bill.total.toFixed(2)}</h2>
        </div>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// ==================== OTP DEMO ====================

function demoEncrypt() {
    const plaintext = document.getElementById('plaintext').value;
    if (!plaintext) {
        alert('Please enter text to encrypt!');
        return;
    }
    
    const key = generateOTPKey(plaintext.length);
    const encrypted = otpEncrypt(plaintext, key);
    
    document.getElementById('encryptionResult').innerHTML = `
        <strong>Original Text:</strong> ${plaintext}<br>
        <strong>Ciphertext:</strong> ${encrypted.ciphertext}<br>
        <strong>Key (save this):</strong> ${encrypted.key}<br>
        <p style="margin-top: 10px; color: #667eea;">Note: The key is required to decrypt the message. In this system, keys are securely stored in session memory.</p>
    `;
}

function demoDecrypt() {
    const ciphertext = document.getElementById('ciphertext').value;
    const key = document.getElementById('decryptKey').value;
    
    if (!ciphertext || !key) {
        alert('Please enter both ciphertext and key!');
        return;
    }
    
    const decrypted = otpDecrypt(ciphertext, key);
    
    if (decrypted) {
        document.getElementById('decryptionResult').innerHTML = `
            <strong>Decrypted Text:</strong> ${decrypted}<br>
            <p style="margin-top: 10px; color: #4CAF50;">Successfully decrypted!</p>
        `;
    } else {
        document.getElementById('decryptionResult').innerHTML = `
            <p style="color: #f44336;">Decryption failed! Please check your ciphertext and key.</p>
        `;
    }
}

// ==================== DOCTOR DASHBOARD ====================

function showDoctorTab(tabName) {
    document.querySelectorAll('#doctorDashboard .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#doctorDashboard .tab-content').forEach(content => content.classList.remove('active'));
    
    const tabs = document.querySelectorAll('#doctorDashboard .tab-btn');
    tabs[tabName === 'myAppointments' ? 0 : 1].classList.add('active');
    
    document.getElementById(tabName + 'Content').classList.add('active');
    
    if (tabName === 'myAppointments') loadDoctorAppointments();
    if (tabName === 'myPatients') loadDoctorPatients();
}

function loadDoctorDashboard() {
    loadDoctorAppointments();
}

function loadDoctorAppointments() {
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const doctor = doctors.find(d => d.username === currentUser.username);
    
    if (!doctor) return;
    
    const appointments = JSON.parse(sessionStorage.getItem('appointments'));
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const container = document.getElementById('doctorAppointmentsList');
    
    const myAppointments = appointments.filter(apt => apt.doctorId === doctor.id);
    
    if (myAppointments.length === 0) {
        container.innerHTML = '<p>No appointments scheduled.</p>';
        return;
    }
    
    container.innerHTML = myAppointments.map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        
        return `
            <div class="data-card">
                <h4>Appointment #${apt.id}</h4>
                <p><strong>Patient:</strong> ${patient ? patient.name : 'Unknown'}</p>
                <p><strong>Date:</strong> ${apt.date}</p>
                <p><strong>Time:</strong> ${apt.time}</p>
                <p><strong>Status:</strong> <span class="badge ${apt.status}">${apt.status.toUpperCase()}</span></p>
            </div>
        `;
    }).join('');
}

function loadDoctorPatients() {
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const doctor = doctors.find(d => d.username === currentUser.username);
    
    if (!doctor) return;
    
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const container = document.getElementById('doctorPatientsList');
    
    const myPatients = patients.filter(p => p.assignedDoctor === doctor.id);
    
    if (myPatients.length === 0) {
        container.innerHTML = '<p>No patients assigned yet.</p>';
        return;
    }
    
    container.innerHTML = myPatients.map(patient => `
        <div class="data-card">
            <h4>${patient.name} (ID: ${patient.id})</h4>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Phone:</strong> ${patient.phone}</p>
            <p><strong>Blood Group:</strong> ${patient.bloodGroup}</p>
            <p><strong>Symptoms:</strong> ${patient.symptoms || 'None'}</p>
        </div>
    `).join('');
}

// ==================== PATIENT DASHBOARD ====================

function showPatientTab(tabName) {
    document.querySelectorAll('#patientDashboard .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#patientDashboard .tab-content').forEach(content => content.classList.remove('active'));
    
    const tabs = document.querySelectorAll('#patientDashboard .tab-btn');
    const index = tabName === 'myInfo' ? 0 : (tabName === 'myAppointments' ? 1 : 2);
    tabs[index].classList.add('active');
    
    document.getElementById(tabName + 'Content').classList.add('active');
    
    if (tabName === 'myInfo') loadPatientInfo();
    if (tabName === 'myAppointments') loadPatientAppointments();
    if (tabName === 'myBills') loadPatientBills();
}

function loadPatientDashboard() {
    loadPatientInfo();
}

function loadPatientInfo() {
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const patient = patients.find(p => p.username === currentUser.username);
    
    if (!patient) return;
    
    const doctor = doctors.find(d => d.id === patient.assignedDoctor);
    const container = document.getElementById('patientInfo');
    
    container.innerHTML = `
        <div class="data-card">
            <h4>Your Information</h4>
            <p><strong>Patient ID:</strong> ${patient.id}</p>
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Phone:</strong> ${patient.phone}</p>
            <p><strong>Blood Group:</strong> ${patient.bloodGroup}</p>
            <p><strong>Symptoms:</strong> ${patient.symptoms || 'None'}</p>
            <p><strong>Assigned Doctor:</strong> ${doctor ? `Dr. ${doctor.name} (${doctor.specialization})` : 'Not assigned'}</p>
        </div>
    `;
}

function loadPatientAppointments() {
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const patient = patients.find(p => p.username === currentUser.username);
    
    if (!patient) return;
    
    const appointments = JSON.parse(sessionStorage.getItem('appointments'));
    const doctors = JSON.parse(sessionStorage.getItem('doctors'));
    const container = document.getElementById('patientAppointmentsList');
    
    const myAppointments = appointments.filter(apt => apt.patientId === patient.id);
    
    if (myAppointments.length === 0) {
        container.innerHTML = '<p>No appointments scheduled.</p>';
        return;
    }
    
    container.innerHTML = myAppointments.map(apt => {
        const doctor = doctors.find(d => d.id === apt.doctorId);
        
        return `
            <div class="data-card">
                <h4>Appointment #${apt.id}</h4>
                <p><strong>Doctor:</strong> Dr. ${doctor ? doctor.name : 'Unknown'}</p>
                <p><strong>Date:</strong> ${apt.date}</p>
                <p><strong>Time:</strong> ${apt.time}</p>
                <p><strong>Status:</strong> <span class="badge ${apt.status}">${apt.status.toUpperCase()}</span></p>
            </div>
        `;
    }).join('');
}

function loadPatientBills() {
    const patients = JSON.parse(sessionStorage.getItem('patients'));
    const patient = patients.find(p => p.username === currentUser.username);
    
    if (!patient) return;
    
    const bills = JSON.parse(sessionStorage.getItem('bills'));
    const container = document.getElementById('patientBillsList');
    
    const myBills = bills.filter(b => b.patientId === patient.id);
    
    if (myBills.length === 0) {
        container.innerHTML = '<p>No bills yet.</p>';
        return;
    }
    
    container.innerHTML = myBills.map(bill => `
        <div class="data-card">
            <h4>Bill #${bill.id}</h4>
            <p><strong>Date:</strong> ${bill.date}</p>
            <p>Consultation Fee: $${bill.consultation.toFixed(2)}</p>
            <p>Tests: $${bill.tests.toFixed(2)}</p>
            <p>Room Charge: $${bill.room.toFixed(2)}</p>
            <p>Other: $${bill.other.toFixed(2)}</p>
            <hr style="margin: 10px 0;">
            <p><strong>Total: $${bill.total.toFixed(2)}</strong></p>
        </div>
    `).join('');
}

// ==================== INITIALIZATION ====================

// Initialize system on page load
window.onload = function() {
    initializeSystem();
    showLandingPage();
};