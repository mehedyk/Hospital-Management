# 🏥 Hospital Management System with OTP Encryption

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

*A comprehensive healthcare management solution with military-grade One-Time Pad encryption*

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Security](#-security) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Security Architecture](#-security-architecture)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [User Roles](#-user-roles)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Encryption Deep Dive](#-encryption-deep-dive)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

**City General Hospital Management System** is a modern, secure, and comprehensive web application designed to streamline healthcare operations. Built with vanilla JavaScript and enhanced with **One-Time Pad (OTP) encryption**, this system provides theoretically unbreakable security for sensitive medical data.

### Why This Project?

- 🔐 **Military-Grade Security**: Implements OTP encryption, the only provably secure encryption method
- 🏥 **Complete Hospital Workflow**: Manages patients, doctors, appointments, and billing
- 🎨 **Modern UI/UX**: Clean, responsive design with smooth animations
- 💾 **Session-Based Storage**: No database required - perfect for demonstrations and prototypes
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

---

## ✨ Features

### 🔒 Security Features

- **One-Time Pad Encryption**: All passwords encrypted with randomly generated keys
- **Session-Based Security**: Data exists only during the browser session
- **Role-Based Access Control**: Separate dashboards for Admin, Doctor, and Patient
- **Secure Authentication**: Encrypted password storage and verification

### 👨‍⚕️ Administrative Functions

- **Patient Management**: Add, view, and manage patient records
- **Doctor Management**: Track doctor availability, specializations, and salaries
- **Appointment Scheduling**: Book and manage appointments with search functionality
- **Billing System**: Generate itemized bills with printable invoices
- **OTP Demo**: Interactive encryption/decryption demonstration

### 👨‍⚕️ Doctor Dashboard

- **Appointment Overview**: View all scheduled appointments
- **Patient List**: Access assigned patient information
- **Real-Time Updates**: See appointment status changes

### 🧑‍🦱 Patient Dashboard

- **Personal Information**: View complete medical profile
- **Appointment History**: Track past and upcoming appointments
- **Billing Records**: Access and review all medical bills

---

## 🛠 Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | Custom CSS with Flexbox & Grid |
| **Storage** | Session Storage API |
| **Encryption** | Custom OTP Implementation |
| **Architecture** | SPA (Single Page Application) |

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔐 Security Architecture

### One-Time Pad (OTP) Encryption

This system implements **true OTP encryption**, providing perfect secrecy when used correctly.
```javascript
// Encryption Process
plaintext → XOR with random key → ciphertext
        ↓
    Base64 encode
        ↓
    Store securely
```

#### Key Properties

1. **Perfect Secrecy**: Mathematically proven to be unbreakable
2. **Key Length**: Keys are exactly as long as the message
3. **Randomness**: Keys generated using cryptographically secure methods
4. **Single Use**: Each key is used only once (session-based)

#### Implementation Details
```javascript
function otpEncrypt(plaintext, key) {
    // XOR each character with corresponding key character
    let ciphertext = '';
    for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i) ^ key.charCodeAt(i);
        ciphertext += String.fromCharCode(charCode);
    }
    return { ciphertext: btoa(ciphertext), key: btoa(key) };
}
```

### Data Protection Layers

1. **Authentication Layer**: OTP-encrypted passwords
2. **Storage Layer**: Session storage (auto-clears on tab close)
3. **Access Control Layer**: Role-based permissions
4. **Transmission Layer**: Base64 encoding for safe storage

---

## 📦 Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Text editor (VS Code, Sublime Text, etc.)
- Local web server (optional, for development)

### Quick Start

1. **Clone the repository**
```bash
   git clone https://github.com/mehedyk/Hospital-Management.git
   cd hospital-management
```

2. **Open the application**
```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Using Python's built-in server
   python -m http.server 8000
   
   # Option 3: Using Node.js http-server
   npx http-server
```

3. **Access the application**
   - Direct: `file:///path/to/index.html`
   - Server: `http://localhost:8000`

### Project Structure
```
hospital-management-system/
│
├── index.html              # Main HTML structure
├── styles.css              # Complete styling (embedded)
├── script.js               # Application logic (embedded)
├── README.md               # This file
│
└── docs/                   # Additional documentation (Yet to be added)
    ├── SECURITY.md         # Security best practices (Yet to be added)
    ├── API.md              # Internal API reference (Yet to be added)
    └── CONTRIBUTING.md     # Contribution guidelines (Yet to be added)
```

---

## 📖 Usage Guide

### Default Credentials

**Admin Account** (Pre-configured)
```
Username: admin
Password: admin123
```

### Creating New Accounts

1. **Navigate to Sign Up** from the landing page
2. **Select Role**: Doctor or Patient
3. **Fill Required Information**:
   - Doctors: Name, Specialization, Salary (optional)
   - Patients: Name, Age, Phone, Blood Group
4. **Submit** and login with your credentials

### Admin Workflow

1. **Login** with admin credentials
2. **Add Doctors** from the Doctors tab
3. **Add Patients** or let them self-register
4. **Schedule Appointments** between patients and doctors
5. **Generate Bills** for patient services
6. **Monitor** all activities from the dashboard

### Doctor Workflow

1. **Login** with doctor credentials
2. **View Appointments** in chronological order
3. **Access Patient Records** for assigned patients
4. **Update** appointment status after consultations

### Patient Workflow

1. **Login** with patient credentials
2. **View Personal Information** and medical history
3. **Track Appointments** with doctors
4. **Review Bills** and payment history

---

## 👥 User Roles

### 🔴 Admin
**Full System Access**

- Manage patients, doctors, appointments
- Generate and view all bills
- Access OTP encryption demo
- System-wide search capabilities

**Permissions**: `CREATE` `READ` `UPDATE` `DELETE`

### 🔵 Doctor
**Medical Staff Access**

- View assigned appointments
- Access patient medical records
- Update appointment status

**Permissions**: `READ` (own data)

### 🟢 Patient
**Personal Access**

- View personal information
- Track appointments
- Access billing history

**Permissions**: `READ` (own data only)

---

## 🔌 API Reference

### Session Storage Structure
```javascript
// User Authentication
sessionStorage.getItem('admin')           // Admin account
sessionStorage.getItem('users')           // Array of all users
sessionStorage.getItem('currentUser')     // Currently logged-in user

// Medical Records
sessionStorage.getItem('patients')        // Array of patients
sessionStorage.getItem('doctors')         // Array of doctors
sessionStorage.getItem('appointments')    // Array of appointments
sessionStorage.getItem('bills')           // Array of bills

// Counters
sessionStorage.getItem('patientIdCounter')    // Next patient ID
sessionStorage.getItem('doctorIdCounter')     // Next doctor ID
sessionStorage.getItem('appointmentIdCounter')// Next appointment ID
sessionStorage.getItem('billIdCounter')       // Next bill ID
```

### Core Functions

#### Encryption Functions
```javascript
// Generate random OTP key
generateOTPKey(length: number): string

// Encrypt plaintext with OTP
otpEncrypt(plaintext: string, key: string): {
    ciphertext: string,
    key: string
}

// Decrypt ciphertext with key
otpDecrypt(ciphertext: string, key: string): string | null
```

#### Authentication Functions
```javascript
// Handle user login
handleLogin(event: Event): void

// Handle user registration
handleSignup(event: Event): void

// Logout current user
logout(): void
```

#### Data Management Functions
```javascript
// Patient operations
addPatient(): void
loadPatients(): void

// Doctor operations
addDoctor(): void
loadDoctors(): void

// Appointment operations
bookAppointment(): void
loadAppointments(): void
searchAppointments(): void

// Billing operations
createBill(): void
loadBills(): void
printBill(billId: string): void
```

---

## 🏗 Project Structure

### HTML Architecture
```html
<!-- Page Structure -->
Landing Page (index)
├── Login Page
│   ├── Role Selection (Admin/Doctor/Patient)
│   └── Authentication Form
├── Signup Page
│   ├── Role Selection (Doctor/Patient)
│   └── Registration Form
├── Admin Dashboard
│   ├── Patients Tab
│   ├── Doctors Tab
│   ├── Appointments Tab
│   ├── Billing Tab
│   └── OTP Demo Tab
├── Doctor Dashboard
│   ├── My Appointments
│   └── My Patients
└── Patient Dashboard
    ├── My Information
    ├── My Appointments
    └── My Bills
```

### CSS Architecture
```css
/* Component Structure */
├── Global Styles (reset, variables)
├── Layout Components
│   ├── Page transitions
│   ├── Hero section
│   └── Navigation
├── UI Components
│   ├── Buttons
│   ├── Forms
│   ├── Cards
│   └── Badges
├── Dashboard Components
│   ├── Tabs
│   ├── Data lists
│   └── Forms
└── Responsive Design
    └── Media queries
```

### JavaScript Architecture
```javascript
// Module Organization
├── Encryption System (OTP implementation)
├── Session Storage Management
├── Navigation Controllers
├── Authentication System
├── Admin Module
│   ├── Patient Management
│   ├── Doctor Management
│   ├── Appointment System
│   └── Billing System
├── Doctor Module
│   ├── Appointment Viewer
│   └── Patient Access
├── Patient Module
│   ├── Profile Viewer
│   ├── Appointment Tracker
│   └── Bill Viewer
└── Utility Functions
```

---

## 🔬 Encryption Deep Dive

### Mathematical Foundation

The One-Time Pad is based on the XOR operation:
```
C = P ⊕ K
P = C ⊕ K

Where:
C = Ciphertext
P = Plaintext
K = Key
⊕ = XOR operation
```

### Security Proof

**Shannon's Theorem**: A cipher has perfect secrecy if:
```
P(M|C) = P(M)
```
Where the probability of the message given the ciphertext equals the probability of the message alone.

### Implementation Flow
```
┌─────────────┐
│  Plaintext  │
└──────┬──────┘
       │
       ├──► Generate Random Key (equal length)
       │
       ├──► XOR Operation
       │
       ├──► Base64 Encoding
       │
       ▼
┌─────────────────────┐
│  Encrypted Storage  │
└─────────────────────┘
```

### Code Example
```javascript
// Real-world usage in the system
const password = "securePassword123";
const key = generateOTPKey(password.length);
// Key: "K8#mP2$xQ9@nL5&yR3"

const encrypted = otpEncrypt(password, key);
// encrypted.ciphertext: "eHh4eHh4eHh4eHh4=="
// encrypted.key: "SzgjbVAyJHhROUBuTDUmeVI="

// Store encrypted data
sessionStorage.setItem('userPassword', encrypted.ciphertext);
sessionStorage.setItem('userKey', encrypted.key);

// Later: Decrypt for authentication
const decrypted = otpDecrypt(encrypted.ciphertext, encrypted.key);
// decrypted: "securePassword123"
```

---

## 💻 Development

### Development Setup
```bash
# Clone the repository
git clone https://github.com/mehedyk/Hospital-Management.git

# Create a development branch
git checkout -b feature/your-feature-name

# Make your changes and test thoroughly

# Commit with descriptive messages
git commit -m "feat: add patient search functionality"
```

### Code Style Guidelines

**JavaScript**
```javascript
// Use camelCase for variables and functions
const patientName = "Saddam Hossain";
function loadPatients() { }

// Use PascalCase for constructors
function User(name, role) { }

// Constants in UPPER_CASE
const MAX_PATIENTS = 1000;

// Descriptive function names
function calculateBillTotal() { } // Good
function calc() { }               // Avoid
```

**CSS**
```css
/* Use kebab-case for classes */
.patient-card { }
.btn-primary { }

/* BEM methodology for complex components */
.dashboard__header { }
.dashboard__header--active { }
```

### Adding New Features

1. **Create a feature branch**
2. **Update relevant sections**:
   - HTML structure (if needed)
   - CSS styles
   - JavaScript logic
   - Session storage schema
3. **Test thoroughly** across all user roles
4. **Update documentation**
5. **Submit pull request**

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Tests
- [ ] Admin login with correct credentials
- [ ] Admin login with incorrect credentials
- [ ] Doctor registration and login
- [ ] Patient registration and login
- [ ] Logout functionality

#### Admin Dashboard Tests
- [ ] Add new patient
- [ ] View patient list
- [ ] Add new doctor
- [ ] View doctor list
- [ ] Book appointment
- [ ] Search appointments
- [ ] Create bill
- [ ] Print bill
- [ ] OTP encryption demo

#### Doctor Dashboard Tests
- [ ] View assigned appointments
- [ ] View assigned patients
- [ ] Access patient details

#### Patient Dashboard Tests
- [ ] View personal information
- [ ] View appointments
- [ ] View billing history

#### Security Tests
- [ ] Password encryption verification
- [ ] Session storage isolation
- [ ] Role-based access control
- [ ] Data persistence during session
- [ ] Data clearance on logout

### Browser Testing

Test the application on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 Deployment

### Static Hosting Options

#### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Select branch: main
# Folder: / (root)

# Your site will be available at:
# https://yourusername.github.io/hospital-management/
```

#### Netlify
```bash
# Drag and drop project folder to Netlify
# Or connect GitHub repository for automatic deployments

# Configure build settings:
# Build command: (leave empty)
# Publish directory: /
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Considerations

⚠️ **Important Notes**:
- Session storage data is **not persistent** across browser restarts
- Data is **isolated per domain**
- For production use, implement a proper backend with database
- OTP encryption is **demonstrative** - use established libraries for production

---

## 🗺 Roadmap

### Version 1.1 (Q2 2025)
- [ ] Local Storage option for persistent demo data
- [ ] Export/Import functionality for patient records
- [ ] PDF report generation
- [ ] Dark mode theme

### Version 1.2 (Q3 2025)
- [ ] Backend integration (Node.js/Express)
- [ ] PostgreSQL database
- [ ] Real authentication system (JWT)
- [ ] Email notifications

### Version 2.0 (Q4 2025)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Telemedicine integration
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **🐛 Report Bugs**: Open an issue with detailed reproduction steps
2. **💡 Suggest Features**: Share your ideas for improvements
3. **📝 Improve Documentation**: Help others understand the project better
4. **💻 Submit Code**: Fix bugs or implement new features

### Contribution Process

1. **Fork the repository**
2. **Create your feature branch**
```bash
   git checkout -b feature/AmazingFeature
```
3. **Commit your changes**
```bash
   git commit -m 'feat: add some AmazingFeature'
```
4. **Push to the branch**
```bash
   git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add patient search functionality
fix: resolve billing calculation error
docs: update installation instructions
style: format code with prettier
refactor: restructure appointment module
test: add unit tests for encryption
chore: update dependencies
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
```
MIT License

Copyright (c) 2025 mehedyk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

### Inspiration

- **Cryptography**: Based on Cyber Security based perfect secrecy theorem
- **Healthcare Systems**: Inspired by real-world hospital management needs
- **Open Source**: Built with the spirit of community collaboration

### Resources

- [One-Time Pad on Wikipedia](https://en.wikipedia.org/wiki/One-time_pad)
- [Web Storage API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Healthcare IT Best Practices](https://www.healthit.gov/)

### Special Thanks

- All contributors who have helped improve this project
- The open-source community for endless inspiration
- Healthcare workers who inspired this project

---

## 📞 Contact & Support

### Get Help

- **Issues**: [GitHub Issues](https://github.com/mehedyk/hospital-management/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mehedyk/hospital-management/discussions)
- **Email**: [contact@mehedyk.dev](mailto:kawser2305341202@diu.edu.bd)

### Connect

- **Portfolio**: [mehedyk.dev](https://mehedyk.netlify.app)
- **GitHub**: [@mehedyk](https://github.com/mehedyk)
- **LinkedIn**: [Mehedy Khan](https://linkedin.com/in/mehedyk)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/mehedyk/hospital-management?style=social)
![GitHub forks](https://img.shields.io/github/forks/mehedyk/hospital-management?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/mehedyk/hospital-management?style=social)

---

<div align="center">

### Made by [mehedyk](https://github.com/mehedyk)

**⭐ Star this repository if you find it helpful!**

[Report Bug](https://github.com/mehedyk/hospital-management/issues) • [Request Feature](https://github.com/mehedyk/hospital-management/issues)

---

© 2025 mehedyk. All Rights Reserved.

</div>