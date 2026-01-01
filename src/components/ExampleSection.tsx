interface ExampleSectionProps {
  onLoadExample: (content: string) => void;
}

export function ExampleSection({ onLoadExample }: ExampleSectionProps) {
  const examples = [
    {
      name: 'Next.js App',
      description: 'Typical Next.js application with authentication and database',
      icon: '⚡',
      gradient: 'from-purple-900/30 to-pink-900/30 border border-purple-500/20',
      content: `# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# External APIs
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Firebase (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com`
    },
    {
      name: 'Node.js API',
      description: 'Backend API with database and external services for a Node.js app',
      icon: '🚀',
      gradient: 'from-purple-900/30 to-pink-900/30 border border-purple-500/20',
      content: `NODE_ENV=production
PORT=8080

# Database
DATABASE_URL=mongodb://localhost:27017/api
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# External APIs
OPENAI_API_KEY=sk-your-openai-api-key
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1`
    },
    {
      name: 'Problematic .env',
      description: 'Example with common issues to demonstrate validation',
      icon: '⚠️',
      gradient: 'from-purple-900/30 to-pink-900/30 border border-purple-500/20',
      content: `NODE_ENV=dev
PORT=abc
DATABASE_URL=localhost:5432

# Weak secrets
API_KEY=123
JWT_SECRET=test

# Missing protocol
REDIS_URL=localhost:6379

# Duplicate keys
STRIPE_KEY=sk_test_123
STRIPE_KEY=sk_test_456

# Public variables with secrets
NEXT_PUBLIC_SECRET_KEY=very-secret-data

# Empty values
OPENAI_API_KEY=
WEBHOOK_URL=`
    }
  ];

  return (
    <div className="glass rounded-2xl border border-white/10 shadow-2xl">
      <div className="p-8">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-lg">✨</span>
          </div>
          Try an Example
        </h3>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Load a sample .env file to see ENV Doctor in action. These examples demonstrate 
          common patterns and issues found in real applications.
        </p>
        
        <div className="grid gap-6 md:grid-cols-3">
          {examples.map((example, index) => (
            <div key={index} className="glass-purple rounded-xl border border-white/10 p-6 group hover:scale-105 transition-all duration-300">
              <div className={`w-12 h-12 bg-gradient-to-br ${example.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-2xl">{example.icon}</span>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">{example.name}</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{example.description}</p>
              <button
                onClick={() => onLoadExample(example.content)}
                className={`w-full px-4 py-3 bg-gradient-to-r ${example.gradient} hover:shadow-lg text-white font-medium rounded-lg transition-all duration-300 transform group-hover:scale-105`}
              >
                Load Example
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 glass-purple rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-blue-300 font-bold text-lg mb-2">Privacy Notice</h4>
              <p className="text-blue-200 leading-relaxed">
                All processing happens locally in your browser. No environment variables or 
                sensitive data is sent to any server or stored anywhere. Your data stays private and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
