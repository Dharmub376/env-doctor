# Env Doctor - Environment Variable Diagnostics Tool

![Env Doctor Screenshot](https://env-doctor.vercel.app/ss1.jpeg)
![Env Doctor Screenshot](https://env-doctor.vercel.app/ss2.jpeg)

A comprehensive web-based tool for analyzing, diagnosing, and managing environment variables in your applications. Env Doctor helps developers identify issues, validate configurations, and ensure environment variables are properly set up across different environments.

## 🌐 Live Demo

Visit the live application: [https://env-doctor.vercel.app/](https://env-doctor.vercel.app/)

## 📁 Repository

[GitHub Repository](https://github.com/Dharmub376/env-doctor)

## ✨ Features

### 🔍 **Environment Variable Analysis**
- **Real-time Validation**: Instantly validate your environment variables
- **Missing Variables Detection**: Identify required environment variables that are missing
- **Type Checking**: Verify that environment variables have the correct data types
- **Format Validation**: Check for proper formatting (URLs, emails, API keys, etc.)

### 🛠️ **Diagnostic Tools**
- **Security Scanner**: Detect sensitive information that shouldn't be exposed
- **Dependency Check**: Identify which environment variables are required by your dependencies
- **Environment Comparison**: Compare variables across different environments (dev, staging, prod)
- **Health Reports**: Generate comprehensive reports about your environment configuration

### 📊 **Visualization**
- **Interactive Dashboard**: Clean, modern interface for managing environment variables
- **Variable Categorization**: Group variables by type, importance, or environment
- **Real-time Feedback**: Get instant feedback as you modify your environment configuration
- **Export Options**: Export configurations in various formats (.env, JSON, YAML)

### 🔒 **Security Features**
- **Secure Handling**: No environment variables are stored or transmitted to external servers
- **Local Processing**: All analysis happens directly in your browser
- **Sensitive Data Detection**: Warning system for potentially exposed secrets
- **Best Practices Guidance**: Recommendations for secure environment variable management

## 🚀 Getting Started

### Using the Web Application

1. **Visit** [https://env-doctor.vercel.app/](https://env-doctor.vercel.app/)
2. **Paste** your environment configuration or .env file content
3. **Click** "Analyze" to run diagnostics
4. **Review** the comprehensive report and recommendations
5. **Apply** fixes based on the suggestions provided

### For Developers

```bash
# Clone the repository
git clone https://github.com/Dharmub376/env-doctor.git

# Navigate to project directory
cd env-doctor

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Deployment**: Vercel
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
env-doctor/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── (routes)/          # Application routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   └── diagnostic/       # Diagnostic-specific components
├── lib/                   # Utility functions and helpers
├── types/                 # TypeScript type definitions
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please read [CONTRIBUTING.md](https://github.com/Dharmub376/env-doctor/blob/main/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Dharmub376/env-doctor/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Dharmub376](https://github.com/Dharmub376)
- Inspired by the challenges of managing environment variables in modern web development
- Thanks to all contributors and the open-source community

## 📞 Support

Found a bug or have a feature request? 
- [Open an Issue](https://github.com/Dharmub376/env-doctor/issues)
- Check the [Discussions](https://github.com/Dharmub376/env-doctor/discussions) for help

## 🔗 Connect

- **GitHub**: [@Dharmub376](https://github.com/Dharmub376)
- **Project Link**: [https://github.com/Dharmub376/env-doctor](https://github.com/Dharmub376/env-doctor)
- **Live Site**: [https://env-doctor.vercel.app/](https://env-doctor.vercel.app/)

---

**Note**: Env Doctor runs entirely in your browser. Your environment variables are never sent to external servers, ensuring complete privacy and security for your sensitive configuration data.

---

⭐ **Star this repo if you find it useful!** ⭐