# MediLock

**CIS5370 Final Project – Secure Record Sharing System**

MediLock is a secure web application built to demonstrate core cybersecurity and web development concepts.  
It allows users to register, log in, verify identity through a console-based 2FA system, and securely access or share stored records.

---

## 🧠 Project Overview

The goal of MediLock is to simulate a secure patient-record sharing portal where each user must authenticate using a password and a time-limited verification code.  
This project emphasizes **security over visual styling** and fulfills the key rubric requirements for backend authentication, session management, and secure data flow.

---

## ⚙️ Features

- User registration with password hashing (`bcrypt`)
- Login with email + password
- Two-factor authentication (2FA) printed to backend console
- JWT-based authentication
- Secure storage using MongoDB Atlas
- RESTful API built with Express.js
- Frontend built in React + TypeScript (Vite)
- Optional email 2FA (via Nodemailer / Ethereal)
- Password reset with reset code
- Optional record upload, view, and share modules (extra credit)

---

## 🗂️ Project Structure

