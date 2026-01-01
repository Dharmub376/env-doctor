import { ValidationResults as ValidationResultsType } from '../lib/envValidator';

interface ValidationResultsProps {
  results: ValidationResultsType;
}

export function ValidationResultsDisplay({ results }: ValidationResultsProps) {
  const { errors, warnings, suggestions } = results;
  const totalIssues = errors.length + warnings.length;

  if (totalIssues === 0 && suggestions.length === 0) {
    return (
      <div className="glass-purple rounded-2xl p-8 border border-green-500/20 glow-green">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-400">All Good!</h3>
            <p className="text-green-300 mt-1">No issues found in your environment variables.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-white/10 p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          Validation Results
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-purple rounded-xl p-6 text-center border border-red-500/20">
            <div className="text-3xl font-bold text-red-400 mb-2">{errors.length}</div>
            <div className="text-red-300 font-medium">Errors</div>
          </div>
          <div className="glass-purple rounded-xl p-6 text-center border border-yellow-500/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{warnings.length}</div>
            <div className="text-yellow-300 font-medium">Warnings</div>
          </div>
          <div className="glass-purple rounded-xl p-6 text-center border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-2">{suggestions.length}</div>
            <div className="text-blue-300 font-medium">Suggestions</div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mb-8">
            <h4 className="text-red-400 font-bold text-lg mb-4 flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              Errors ({errors.length})
            </h4>
            <div className="space-y-3">
              {errors.map((error, index) => (
                <div key={index} className="glass-purple rounded-xl p-4 border border-red-500/30">
                  <div className="flex justify-between items-start">
                    <p className="text-red-300 flex-1">{error.message}</p>
                    {error.line > 0 && (
                      <span className="text-red-400 text-sm font-mono bg-red-500/20 px-2 py-1 rounded ml-3">
                        Line {error.line}
                      </span>
                    )}
                  </div>
                  {error.key && (
                    <p className="text-red-400 text-sm font-mono mt-2 bg-red-500/10 px-2 py-1 rounded inline-block">
                      Key: {error.key}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mb-8">
            <h4 className="text-yellow-400 font-bold text-lg mb-4 flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              Warnings ({warnings.length})
            </h4>
            <div className="space-y-3">
              {warnings.map((warning, index) => (
                <div key={index} className="glass-purple rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex justify-between items-start">
                    <p className="text-yellow-300 flex-1">{warning.message}</p>
                    {warning.line > 0 && (
                      <span className="text-yellow-400 text-sm font-mono bg-yellow-500/20 px-2 py-1 rounded ml-3">
                        Line {warning.line}
                      </span>
                    )}
                  </div>
                  {warning.key && (
                    <p className="text-yellow-400 text-sm font-mono mt-2 bg-yellow-500/10 px-2 py-1 rounded inline-block">
                      Key: {warning.key}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div>
            <h4 className="text-blue-400 font-bold text-lg mb-4 flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Suggestions ({suggestions.length})
            </h4>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="glass-purple rounded-xl p-4 border border-blue-500/30">
                  <div className="flex justify-between items-start">
                    <p className="text-blue-300 flex-1">{suggestion.message}</p>
                    {suggestion.line > 0 && (
                      <span className="text-blue-400 text-sm font-mono bg-blue-500/20 px-2 py-1 rounded ml-3">
                        Line {suggestion.line}
                      </span>
                    )}
                  </div>
                  {suggestion.key && (
                    <p className="text-blue-400 text-sm font-mono mt-2 bg-blue-500/10 px-2 py-1 rounded inline-block">
                      Key: {suggestion.key}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
