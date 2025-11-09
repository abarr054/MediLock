# 🩺 MediLock  
**CIS5370 – Principles of Cybersecurity (Final Project)**  
Florida International University  

A secure medical record-sharing web application built for the CIS5370 final project.  
MediLock enables users to register, log in with two-factor authentication (2FA), and demonstrate secure backend and frontend communication.  
This project focuses on authentication, security best practices, and functional demonstration aligned with the course rubric.  

---

## 🚀 Features

- User registration with hashed passwords (bcrypt)  
- Two-Factor Authentication (2FA) using email verification codes  
- JWT-based authentication for session security  
- Secure backend communication via REST API  
- MongoDB Atlas database integration  
- Console logging of 2FA codes for local testing and demonstration  
- Optional Gmail-based email delivery (via Nodemailer)  

---

## 🧩 Project Structure

MediLock/
│
├── backend/ # Node.js + Express + MongoDB API
│ ├── src/
│ │ ├── controllers/ # Authentication logic
│ │ ├── models/ # MongoDB user model
│ │ ├── routes/ # Express route definitions
│ │ └── server.js # Backend entry point
│ ├── .env # Environment variables
│ └── package.json
│
├── frontend/ # React + TypeScript (Vite)
│ ├── src/
│ │ ├── api/ # Axios client for API requests
│ │ ├── pages/ # Login, Register, 2FA pages
│ │ ├── layout/ # DashboardLayout component
│ │ └── main.tsx # Frontend entry point
│ └── package.json
│
├── docs/ # Presentation and screenshots
├── LICENSE
└── README.md

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
If using the GitHub web interface, download and extract the ZIP.  
Or via command line:
```bash
git clone https://github.com/abarr054/MediLock.git
cd MediLock
cd backend
npm install
cd ../frontend
npm install
# MongoDB connection
MONGO_URI=mongodb+srv://<your-mongodb-uri>

# JWT secret
JWT_SECRET=yoursecret

# Backend server port
PORT=4000

# Gmail SMTP Configuration (for 2FA and Password Reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_app_password_here
⚠️ Important:
You must use a Google App Password, not your normal Gmail password.

Visit https://myaccount.google.com/apppasswords

Choose Mail → Other (Custom name) → “MediLock”

Copy the generated 16-character app password and paste it as SMTP_PASS.

If left blank, MediLock automatically falls back to Ethereal, a test-only email provider suitable for classroom demos.
cd backend
npm run dev
Mongo connected
Backend on http://localhost:4000
2FA code for createduseremail@mail.com is 524087
cd frontend
npm run dev
http://localhost:5173

🧑‍💻 Development Notes

Console-based 2FA verification is fully functional and required for rubric demonstration.

Real email delivery via Gmail or Ethereal is supported for optional presentation.

Focused on authentication, security, and clarity rather than UI complexity.

Optional features like file upload and record sharing are beyond rubric requirements.

🪪 License

This project is licensed under the MIT License.
© 2025 Alexander Barrios, Florida International University
