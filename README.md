# RizeOS - Web3 AI Job & Networking Portal

A full-stack web application inspired by platforms like LinkedIn and Upwork, enhanced with modern AI and Web3 blockchain features. This project was built as part of the RizeOS Core Team Internship assessment.

**Live Demo:** **[https://YOUR_VERCEL_APP_LINK.vercel.app/](https://YOUR_VERCEL_APP_LINK.vercel.app/)**

---

## 🚀 Project Overview

This platform serves as a decentralized hub for Web3 professionals and recruiters. It addresses common issues in the tech hiring space by integrating AI for smarter matching and blockchain for verified, low-cost transactions. Users can create detailed profiles, post jobs, and find opportunities, while leveraging AI to understand skill gaps and job suitability. The Web3 integration ensures a transparent and secure payment system for platform fees.

## ✨ Key Features

### Core Functionality

- **User Authentication**: Secure JWT-based registration, login, and session management.
- **Profile Management**: Users can create and edit detailed profiles including their bio, skills, and LinkedIn URL.
- **Job Posting System**: Authenticated users can post new job opportunities with detailed descriptions, required skills, and budget.
- **Dynamic Job Feed**: A responsive, two-column grid layout to browse all available job listings.
- **Skill-Based Filtering**: A real-time search filter to find jobs based on specific skills.

### 🤖 AI-Powered Features

- **PDF Resume Parsing**: Users can upload their resume in PDF format, and the backend AI will automatically parse it to extract and suggest relevant skills.
- **Job-Applicant Match Score**: Logged-in users can see a percentage-based "match score" on any job listing, showing them how well their skills align with the job's requirements.
- **Skill Extraction from Text**: Users can also paste their bio, and the AI will identify and suggest skills from the text.

### ⛓️ Web3 Blockchain Integration

- **Decentralized Payments**: Before posting a job, users must pay a small platform fee using POL tokens on the Polygon Amoy testnet.
- **MetaMask Integration**: The application seamlessly connects with the user's MetaMask wallet to initiate and sign transactions.
- **On-Chain Verification**: The job posting form is only enabled after the payment transaction is successfully confirmed on the blockchain.

---

## 🛠️ Tech Stack

| Layer          | Technology                                                                |
| -------------- | ------------------------------------------------------------------------- |
| **Frontend**   | React.js, Vite, React Router, Axios                                       |
| **Styling**    | CSS with Flexbox & Grid, Keyframe Animations                              |
| **Backend**    | Node.js, Express.js                                                       |
| **Database**   | MongoDB with Mongoose                                                     |
| **Blockchain** | Polygon (Amoy Testnet), Ethers.js                                         |
| **AI/ML**      | `pdf-parse` for PDF reading, `multer` for file handling, Custom NLP Logic |
| **Deployment** | Vercel (Frontend + Serverless Backend)                                    |

---

## 🌐 Application Workflow

1.  **Registration & Profile Setup**: A new user registers for an account. They navigate to their profile page and click "Edit."
2.  **AI Skill Extraction**: The user uploads their PDF resume. The AI backend parses the file, extracts skills, and auto-populates the skills field. The user saves their profile.
3.  **Job Posting**: A recruiter (or any user) decides to post a job. They fill out the job details form.
4.  **Web3 Payment**: To submit the job, the user is prompted to pay a small fee. They connect their MetaMask wallet (on the Polygon Amoy network) and approve the transaction.
5.  **Job Feed & Matching**: Once the transaction is confirmed, the job is posted. Other logged-in users can now see this job in the feed and click "See Your Match Score" to understand how their skills compare to the job requirements.
6.  **Filtering**: Users can type "React" or "Python" into the search bar on the job feed to instantly filter the list for relevant opportunities.

---

## ⚙️ Local Setup & Installation

To run this project locally, follow these steps:

**Prerequisites:**

- Node.js (v18 or later)
- npm
- MongoDB (local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

**1. Clone the repository:**

```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
```

**2. Backend Setup:**

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:

```
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_KEY
```

**3. Frontend Setup:**

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory and add the following variable:

```
VITE_ADMIN_WALLET_ADDRESS=YOUR_METAMASK_WALLET_ADDRESS
```

**4. Run the Application:**

- Open one terminal and run the backend server:
  ```bash
  cd server
  npm run dev
  ```
- Open a second terminal and run the frontend client:
  `bash
    cd client
    npm run dev
    `
  The frontend will be available at `http://localhost:5173`.

---

## 👤 Author

- **[Your Name]**
- GitHub: [@your-github-username](https://github.com/your-github-username)
- LinkedIn: [your-linkedin-profile](https://linkedin.com/in/your-profile)
