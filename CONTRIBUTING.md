# Contributing to Env Doctor

First off, thank you for considering contributing to Env Doctor! It's people like you that make open source such an amazing community. 🙏

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Your First Code Contribution](#your-first-code-contribution)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/env-doctor.git
   cd env-doctor
   ```
3. **Add the original repo as upstream**:
   ```bash
   git remote add upstream https://github.com/Dharmub376/env-doctor.git
   ```
4. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

## 🤔 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, please check the [existing issues](https://github.com/Dharmub376/env-doctor/issues) to avoid duplicates.

**How to submit a good bug report:**
1. **Use a clear and descriptive title**
2. **Describe the exact steps to reproduce the problem**
3. **Provide specific examples** (code snippets, screenshots, links)
4. **Describe the behavior you observed**
5. **Explain the behavior you expected**
6. **Include environment details**:
   - Browser and version
   - Operating system
   - Node.js version (if relevant)

### 💡 Suggesting Features

We welcome feature suggestions! Before suggesting a new feature:

1. Check if it's already in the [issues](https://github.com/Dharmub376/env-doctor/issues) or [roadmap](#)
2. Explain why this feature would be useful to most users
3. Consider if it aligns with the project's goals

**Feature request template:**
- **Use case**: Why is this feature important?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other ways to achieve this?
- **Additional context**: Screenshots, links, examples

### 👩‍💻 Your First Code Contribution

Looking for your first contribution? Check out issues labeled:
- `good-first-issue` - Perfect for newcomers
- `help-wanted` - Looking for contributors
- `beginner-friendly` - Simple tasks to get started

## 💻 Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage
```

## 🔀 Pull Request Process

1. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Follow coding guidelines** (see below)

3. **Add tests** for new functionality

4. **Update documentation** if needed

5. **Ensure all tests pass**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

6. **Create a descriptive PR**:
   - Use the PR template
   - Describe changes clearly
   - Reference related issues
   - Include screenshots for UI changes

7. **Wait for review** - maintainers will review your PR

## 📝 Coding Guidelines

### TypeScript

- Use TypeScript strictly with proper type definitions
- Avoid `any` type - use `unknown` or specific types
- Define interfaces for component props
- Use meaningful type and interface names

### React/Next.js

- Use functional components with hooks
- Follow Next.js App Router conventions
- Use server components where appropriate
- Keep components small and focused

### Styling

- Use Tailwind CSS for styling
- Follow responsive design principles
- Use semantic HTML
- Maintain accessibility (a11y) standards

### Code Style

- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(analyzer): add support for JSON environment files

- Added JSON file parsing capability
- Updated file upload component
- Added relevant tests

Closes #123
```

## 🏗️ Project Structure

```
env-doctor/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── (routes)/          # Application routes
│   │   ├── layout.tsx     # Route layouts
│   │   ├── page.tsx       # Route pages
│   │   └── loading.tsx    # Loading states
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── diagnostic/       # Diagnostic tools components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── lib/                   # Utilities and helpers
│   ├── utils/            # Utility functions
│   ├── constants/        # Constants
│   ├── types/            # TypeScript types
│   └── validators/       # Validation logic
├── hooks/                # Custom React hooks
├── public/               # Static assets
├── tests/                # Test files
├── .github/              # GitHub workflows and templates
└── docs/                 # Documentation
```

## 🧪 Testing

### Writing Tests

- Write unit tests for utilities and hooks
- Write integration tests for components
- Use Jest and React Testing Library
- Mock external dependencies

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test -- src/path/to/test.ts
```

## 🌟 Community

### Get in Touch

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and discussions
- **Pull Requests**: For code contributions

### Recognition

All contributors will be:
- Listed in the contributors section
- Recognized in release notes
- Appreciated in our hearts ❤️

### Need Help?

- Check existing issues and discussions
- Ask in GitHub Discussions
- Reach out to maintainers



## 🙏 Thank You!

Thank you for taking the time to contribute! Your efforts help make Env Doctor better for everyone. Whether you're reporting a bug, suggesting a feature, or submitting code, your contribution is valued and appreciated.

---
