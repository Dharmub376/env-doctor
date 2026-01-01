import { useState, useCallback } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { EnvParser } from "./lib/envParser";
import { EnvValidator, ValidationResults } from "./lib/envValidator";
import { OutputGenerator, GeneratedOutputs } from "./lib/outputGenerator";
import { FileUpload } from "./components/FileUpload";
import { ValidationResultsDisplay } from "./components/ValidationResults";
import { OutputSection } from "./components/OutputSection";
import { ExampleSection } from "./components/ExampleSection";

export default function App() {
  const [envContent, setEnvContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);
  const [outputs, setOutputs] = useState<GeneratedOutputs | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processEnvFile = useCallback((content: string) => {
    if (!content.trim()) {
      setValidationResults(null);
      setOutputs(null);
      return;
    }

    setIsProcessing(true);

    try {
      // Parse the .env content
      const parser = new EnvParser();
      const parsed = parser.parse(content);

      // Validate the parsed content
      const validator = new EnvValidator();
      const results = validator.validate(parsed);

      // Generate outputs
      const generator = new OutputGenerator();
      const generatedOutputs = generator.generate(parsed, results);

      setValidationResults(results);
      setOutputs(generatedOutputs);
    } catch (error) {
      console.error("Error processing env file:", error);
      setValidationResults({
        errors: [{ message: "Failed to parse .env file", line: 0 }],
        warnings: [],
        suggestions: []
      });
      setOutputs(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setEnvContent(content);
    processEnvFile(content);
  }, [processEnvFile]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-purple-700/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                        linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <header className="relative border-b border-white/10 bg-black/30 backdrop-blur-2xl shadow-2xl shadow-purple-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-16 h-16 ">
                    <img src="logo.png" alt="" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    ENV Doctor
                  </h1>
                  <span className="text-sm bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-medium">
                    Privacy-First .env Debugger
                  </span>
                </div>
              </div>
              <Authenticated>
                <SignOutButton />
              </Authenticated>
            </div>
          </div>
        </header>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Unauthenticated>
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <div className="relative mx-auto mb-8">
                  <div className="w-32 h-32  rounded-3xl flex items-center justify-center mx-auto shadow-2xl glow-purple animate-float">
                    <img src="logo.png" alt="" />
                  </div>
                  <div className="absolute -inset-4 opacity-30"></div>
                </div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Debug Your Environment Variables
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  Validate .env files, detect security issues, and generate deployment-ready outputs.
                  <span className="block mt-2 text-purple-300 font-medium">
                    All processing happens in your browser — no data is stored or logged.
                  </span>
                </p>
              </div>
              <div className="glass-effect rounded-3xl p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
                <SignInForm />
              </div>
            </div>
          </Unauthenticated>

          <Authenticated>
            <div className="space-y-12 animate-fade-in">
              {/* Header Section */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-2 px-4 mb-4 rounded-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20">
                  <span className="text-sm font-medium text-purple-300">Secure • Private • Local Processing</span>
                </div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Debug Your Environment Variables
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                  Paste or upload your .env file to validate configuration, detect security issues,
                  and generate deployment-ready outputs. All processing happens locally in your browser.
                </p>
              </div>

              {/* Input Section */}
              <div className="glass-effect rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="p-10">
                  <div className="flex items-center mb-8">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl blur opacity-30"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Input Your .env File</h3>
                      <p className="text-gray-400">Upload a file or paste content below</p>
                    </div>
                  </div>

                  <FileUpload onContentChange={handleContentChange} />

                  <div className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                      <label htmlFor="env-textarea" className="block text-lg font-semibold text-gray-200">
                        Or paste your .env content:
                      </label>
                      <span className="text-sm text-gray-400 font-mono">
                        {envContent.length} characters
                      </span>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                      <textarea
                        id="env-textarea"
                        value={envContent}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Paste your .env content here:

NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your-secret-key
PORT=3000
REDIS_URL=redis://localhost:6379
JWT_SECRET=super-secret-key-here"
                        className="relative w-full h-72 px-6 py-5 bg-black/40 border border-white/10 rounded-2xl text-gray-100 font-mono text-sm focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none resize-none backdrop-blur-sm placeholder-gray-500/70 leading-relaxed transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-4 glass-effect rounded-2xl px-8 py-4 border border-purple-500/20 backdrop-blur-xl animate-pulse">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent"></div>
                      <div className="absolute inset-0 animate-spin rounded-full h-8 w-8 border-2 border-pink-400 border-t-transparent opacity-50" style={{ animationDirection: 'reverse' }}></div>
                    </div>
                    <div>
                      <span className="text-lg font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        Processing your environment variables...
                      </span>
                      <p className="text-sm text-gray-400 mt-1">This happens locally in your browser</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Results */}
              {validationResults && (
                <ValidationResultsDisplay results={validationResults} />
              )}

              {/* Output Section */}
              {outputs && (
                <OutputSection outputs={outputs} />
              )}

              {/* Example Section */}
              {!envContent && (
                <ExampleSection onLoadExample={handleContentChange} />
              )}
            </div>
          </Authenticated>
        </main>

        <footer className="relative border-t border-white/10 mt-20 bg-black/30 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl flex items-center justify-center shadow-lg glow-green">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    100% Private & Secure
                  </p>
                  <p className="text-gray-400 text-sm">All processing happens in your browser</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-3xl">
                <div className="space-y-2">
                  <div className="text-gray-300 font-medium"> No Data Storage</div>
                  <p className="text-sm text-gray-500">Nothing leaves your browser</p>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-300 font-medium"> Instant Processing</div>
                  <p className="text-sm text-gray-500">Real-time validation & debugging</p>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-300 font-medium"> Production Ready</div>
                  <p className="text-sm text-gray-500">Deployment-ready outputs</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm pt-4 border-t border-white/10">
                Built with ❤️ for developers who care about security and privacy
              </p>
            </div>
          </div>
        </footer>

        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
      </div>
    </>

  );
}
