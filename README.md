# Simple9999 - Agentic Resume Builder

![Simple9999 Banner](/public/icon.svg)

> **Agentic Resume Builder with Simplicity.**
> Stop filling forms. Just tell it what you want.

Simple9999 is a cutting-edge, AI-powered resume builder designed to take the pain out of job applications. Instead of manually editing templates or filling out endless forms, Simple9999 uses advanced LLMs (Gemini, Groq) to understand your professional background and tailor your resume specifically for the job you want—just by analyzing your existing documents and the job description.

## ✨ Key Features

- **🤖 Agentic AI Workflow** - Utilizes `Gemini 2.5 Flash Lite` and `Llama 3.3` (via Groq) to intelligently parse, analyze, and rewrite resume content.
- **📄 Scattered Document Ingestion** - Upload PDFs, messy text files, or images. The system extracts and organizes your professional history.
- **🎯 Targeted Customization** - Paste a job description, and the AI will tailor your resume to highlight the most relevant skills and experiences.
- **📊 ATS Score Analysis** - Built-in optimization to ensure your resume passes Applicant Tracking Systems (ATS).
- **📝 Professional PDF Output** - Generates high-quality, LaTeX-compiled PDFs using a Tectonic backend, ensuring perfect formatting every time.
- **🎨 Modern UI/UX** - A beautiful, responsive interface built with Next.js, Framer Motion, and Tailwind CSS.
- **🌓 Light & Dark Mode** - Fully supported theme switching.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **AI & LLM:**
  - [LangChain](https://js.langchain.com/)
  - [Google Generative AI](https://ai.google.dev/)
  - [Groq SDK](https://groq.com/)
  - [HuggingFace Inference](https://huggingface.co/)
- **Database:** MongoDB (via [Mongoose](https://mongoosejs.com/))
- **Authentication:** JWT (Jose)
- **PDF Generation:** LaTeX (Tectonic)
- **Utilities:** `pdfreader`, `tesseract.js` (OCR)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/simple9999.git
   cd simple9999
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following keys:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/simple9999

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key
   # Optional: Default user ID for dev mode fallback
   DEV_USER_ID=your_dev_user_id

   # AI Services
   GOOGLE_API_KEY=your_google_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   HUGGINGFACE_API_KEY=your_huggingface_key

   # Cloudinary (if used for image uploads)
   CLOUDINARY_URL=cloudinary://key:secret@cloud_name
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
simple9999/
├── app/                # Next.js App Router pages and API routes
├── components/         # Reusable UI components
│   ├── ui/             # Generic UI elements (buttons, inputs)
│   └── ...             # Feature-specific components
├── lib/                # core logic and utility functions
│   ├── ai-service.ts   # AI generation logic (Resume, LaTeX)
│   ├── llm-client.ts   # LLM client configuration (Groq, Gemini)
│   ├── db.ts           # Database connection
│   └── ...
├── models/             # Mongoose schemas (User, Resume, etc.)
└── public/             # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
