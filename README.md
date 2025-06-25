# 🛡️ Aegis Veritas

**AI Research Assistant with Multi-Model Consensus & Real-Time Risk Analysis**

Aegis Veritas is an advanced AI research platform that combines multi-model consensus, real-time web search, and comprehensive safety analysis to provide verified, trustworthy AI insights.

## ✨ Features

- **🤖 Multi-Model Consensus**: Queries 3 different AI models (Llama3-8b, Mixtral-8x7b, Llama3-70b) and uses consensus algorithms for reliable responses
- **🔍 Real-Time Fact Checking**: Integrates Tavily search for up-to-date information and source verification
- **🛡️ Risk Analysis**: Comprehensive safety monitoring including bias detection, toxicity screening, hallucination checks, and intent alignment
- **📊 Progressive Analysis**: Real-time progress indicators showing safety metrics as they're calculated
- **💜 Modern UI**: Professional interface with glassmorphism effects and smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- [Groq API Key](https://console.groq.com/) (for AI models)
- [Tavily API Key](https://tavily.com/) (for web search)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd 100-Agents-Project
npm install
```

2. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_TAVILY_API_KEY=your_tavily_api_key_here
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173`

## 🎯 How It Works

### Multi-Model Consensus
1. **Query Processing**: User questions are sent to 3 AI models simultaneously
2. **Similarity Analysis**: Responses are analyzed using Jaccard similarity algorithms
3. **Consensus Building**: High agreement = unified response, disagreement = multiple perspectives shown

### Real-Time Risk Analysis
- **Clarity**: How clear and understandable is the response?
- **Bias**: Detection of potential bias or unfair perspectives  
- **Toxicity**: Screening for harmful or inappropriate content
- **Hallucination**: Checking for potentially false or invented information
- **Intent Alignment**: How well does the response match user intent?

### Web Search Integration
- Tavily search provides real-time context before AI responses
- Sources are displayed with each response for verification
- Fact-grounding helps reduce hallucinations

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Material-UI with custom theming
- **AI Models**: Groq (Llama3, Mixtral, Gemma)
- **Search**: Tavily API for real-time web search
- **Styling**: Custom glassmorphism design system

## 📱 Demo Mode

If API keys are not configured, the app runs in demo mode with:
- Realistic mock risk analysis metrics
- Simulated progressive analysis
- Example consensus responses

## 🏗️ Architecture

```
src/
├── agents/           # AI agent implementations
│   ├── ConsensusAgent.ts      # Multi-model consensus logic
│   ├── ComplianceAgent.ts     # Risk analysis & safety checks  
│   ├── TavilySearchAgent.ts   # Web search integration
│   └── Individual model agents...
├── components/       # React UI components
│   ├── AppLayout.tsx          # Main layout & hero section
│   ├── ConversationFlow.tsx   # Chat interface
│   └── SafetyReport.tsx       # Risk analysis display
└── App.tsx          # Main application orchestrator
```

## 🎨 Design System

**Aegis Veritas** uses a custom design inspired by modern AI interfaces:
- **Colors**: Deep navy backgrounds with purple/teal accents
- **Typography**: Inter font family with optimized spacing
- **Effects**: Glassmorphism cards with backdrop blur
- **Animations**: Smooth cubic-bezier transitions

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
- `VITE_GROQ_API_KEY` - Required for AI model access
- `VITE_TAVILY_API_KEY` - Required for web search functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built for the 100 Agents Hackathon** 🏆

*Aegis Veritas - Where AI research meets uncompromising safety standards.*
