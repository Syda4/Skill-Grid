# 🎯 Skill-Grid
>  Online Skill Assessment & Digital Certification Platform.

Skill-Grid streamlines technical evaluation and credential verification. It allows administrators and evaluators to design standardized assessments, enables candidates to take timed technical tests, auto-evaluates submissions, and instantly issues verifiable digital certificates.

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture & How It Works](#-system-architecture--how-it-works)
- [How to Use the Platform](#-how-to-use-the-platform)
  - [For Candidates / Students](#1-candidates--students)
  - [For Evaluators / Instructors](#2-evaluators--instructors)
  - [For Administrators](#3-administrators)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Setup](#installation--local-setup)
- [License](#-license)

---

## 🚀 Overview

Evaluating candidate skills manually is slow, prone to bias, and difficult to scale. **Skill-Grid** solves this by centralizing:
1. **Curated Assessments:** Domain-specific coding, technical, and MCQ tests.
2. **Real-Time Proctoring & Timing:** Controlled assessment windows with auto-submit mechanisms.
3. **Instant Automated Scoring:** Instant scoring engines that evaluate answers without human latency.
4. **Verifiable Digital Credentials:** Dynamic, tamper-evident digital certificates generated upon meeting benchmark scores.

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Separate interfaces and permissions for Candidates, Evaluators, and Admins.
- **Dynamic Assessment Engine:** Supports multiple question types (MCQs, conceptual logic, technical questions) with customizable test durations, passing thresholds, and negative marking.
- **Automated Evaluation Pipeline:** Instant score calculation upon completion with breakdown by skill category.
- **Automated Certificate Generation:** Generates downloadable, unique digital certificates (PDF/Image) stamped with candidate credentials and completion metadata.
- **Certificate Verification:** Public verification route to authenticate certificates by Certificate ID or QR code.
- **Performance Analytics:** Visual breakdown of weak and strong topics for candidates and score distribution metrics for evaluators.

---

## ⚙️ System Architecture & How It Works

```
 ┌──────────────┐       REST API / JWT Auth       ┌──────────────────────┐
 │ React Client │ ◄─────────────────────────────► │ Express / Node API   │
 └──────────────┘                                 └──────────┬───────────┘
                                                             │
                                        ┌────────────────────┼───────────────────┐
                                        ▼                    ▼                   ▼
                                 ┌──────────────┐     ┌──────────────┐    ┌──────────────┐
                                 │   MongoDB    │     │ Evaluation   │    │ Certificate  │
                                 │   Database   │     │    Engine    │    │  Generator   │
                                 └──────────────┘     └──────────────┘    └──────────────┘
```

1. **Authentication & Session:** Users authenticate via JWT tokens. Role claims determine dashboard routing (`/admin`, `/evaluator`, `/candidate`).
2. **Assessment Delivery:** Tests are fetched with client-side timers synchronized with server-side timestamps to prevent time-tampering.
3. **Submission & Scoring:** On submit (or auto-submit when the timer expires), the backend evaluates the response payload against the stored solution matrix and calculates category-level scores.
4. **Credential Issuance:** If `Total Score >= Passing Threshold`, the certificate generation pipeline generates a tamper-evident digital certificate with a unique UUID/hash and links it to the candidate's profile.

---

## 👥 How to Use the Platform

### 1. Candidates / Students
1. **Sign Up / Log In:** Create an account and complete your profile.
2. **Browse Tests:** Navigate to the **Available Assessments** catalog and select a test matching your target skill.
3. **Take the Assessment:** 
   - Read the rules, time limit, and passing criteria.
   - Complete questions within the allotted window.
   - Track progress via the question palette.
4. **View Results:** Check your immediate performance breakdown, score percentage, and passing status.
5. **Download Certificate:** If qualified, navigate to **My Certificates** to view, download, or share your digital certificate.

### 2. Evaluators / Instructors
1. **Assessment Creation:** Build new skill tests, set difficulty levels, define time limits, and configure passing marks.
2. **Question Bank Management:** Add, update, or tag questions by topic and difficulty.
3. **Track Submissions:** Review candidate attempts, track completion rates, and inspect detailed score summaries.

### 3. Administrators
1. **User Management:** Oversee candidate and evaluator accounts, handle permissions, and monitor platform activity.
2. **Credential Auditing:** Manage certificate templates, review issued credentials, and verify certificate validity.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS / Bootstrap, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT), Bcrypt
- **Document / Certificate Generation:** peculiar/x509
- **Tools & Testing:** Git, Postman

---

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- `npm`

### Installation & Local Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/Syda4/Skill-Grid.git](https://github.com/Syda4/Skill-Grid.git)
cd Skill-Grid
```

2. **Backend Setup:**
```bash
cd server   # or backend directory
npm install
```

Create a `.env` file in the backend root:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillgrid
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

3. **Frontend Setup:**
```bash
cd ../client   # or frontend directory
npm install
npm start
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
