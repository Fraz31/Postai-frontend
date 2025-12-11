# Social Monkey 🐵

**AI-Powered Social Media Automation Platform**

Social Monkey is a modern SaaS application that helps creators and businesses automate their social media workflow. From AI content generation to scheduling and analytics, everything is streamlined in one beautiful dashboard.

![Social Monkey Dashboard](https://via.placeholder.com/1200x600?text=Social+Monkey+Dashboard+Preview)

## 🚀 Features

- **🤖 AI Content Generator**: Create engaging posts, threads, and articles in seconds using advanced AI.
- **📅 Smart Scheduling**: Plan your content calendar with an intuitive drag-and-drop interface.
- **📊 Advanced Analytics**: Track engagement, growth, and performance across all platforms.
- **🎨 Content Library**: Organize and manage your drafts and published posts.
- **🔌 Multi-Platform Support**: Twitter/X, LinkedIn, Instagram, Facebook, and more.
- **💎 Premium UI/UX**: A stunning, dark-mode interface with glassmorphism and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: Vanilla JS (SPA Architecture), CSS3 (Custom Design System), HTML5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o Integration
- **Deployment**: Render / Vercel

## 🏁 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas Account
- OpenAI API Key (Optional for demo mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/social-monkey.git
   cd social-monkey
   ```

2. **Install Backend Dependencies**
   ```bash
   cd postai-backend
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in `postai-backend`:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_key (optional)
   PORT=5000
   ```

4. **Run the Backend**
   ```bash
   npm start
   ```

5. **Run the Frontend**
   Open `postai-frontend/index.html` in your browser or use a local server:
   ```bash
   cd postai-frontend
   npx http-server
   ```

## 💡 Investor Note

This project is currently in **MVP (Minimum Viable Product)** stage. 
- **Demo Mode**: The application runs in a fully functional demo mode even without API keys.
- **Scalability**: Built with a modular architecture ready for horizontal scaling.
- **Market Fit**: Addresses the growing need for AI-driven content automation.

## 📄 License

MIT License - Copyright © 2024 Social Monkey
