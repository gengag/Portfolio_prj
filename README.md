# 🧠 AI Exam Coach — Intelligent Exam Preparation Platform

An AI-powered adaptive exam preparation platform built with the MERN stack (MongoDB, Express, React, Node.js, TypeScript) and OpenAI.

---

## 🌟 Key Highlights

- **Adaptive AI Question Generation**: Dynamically creates exam-grade multiple choice questions tuned to targeted exams (Banking, SSC, UPSC, etc.) with structured JSON validation.
- **Deep Mistake Diagnostics**: 6-step beginner-friendly AI explanations detailing the solution and exact reason why a selected option was mistaken.
- **Deterministic Analytics Engine**: Accurate mathematical tracking of subject and topic mastery without hallucinated statistics.
- **AI Tutor & Multi-Mode Chat**: Interactive conversational tutor with 7 specialized instruction modes.
- **RAG Document Knowledge Base**: Ingest syllabus and study PDFs with semantic chunking, embeddings (`text-embedding-3-small`), and multi-tenant vector search.
- **Extensible Curriculum Architecture**: Flexible Exam -> Subject -> Topic -> Subtopic hierarchy stored in MongoDB.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, Axios, Custom Cyber-Slate Design System, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Mongoose, OpenAI Node SDK, Zod Schema Validation, Helmet, Rate Limiting, JWT & Bcrypt.
- **Database**: MongoDB with Vector Search capabilities.

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MONGODB_URI and OPENAI_API_KEY
npm install
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and proxy `/api` requests to `http://localhost:5000`.

---

## 🛡️ Security Best Practices

- **Zero Client Secret Exposure**: OpenAI API Key is strictly server-side and never exposed to React or network clients.
- **Tenant-Isolated RAG**: Vector queries and document retrievals are strictly filtered by authenticated user IDs.
- **Structured Output Validation**: AI JSON responses are validated against Zod schemas before persistence.
