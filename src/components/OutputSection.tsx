import { useState } from 'react';
import { GeneratedOutputs } from '../lib/outputGenerator';
import { toast } from 'sonner';

interface OutputSectionProps {
  outputs: GeneratedOutputs;
}

export function OutputSection({ outputs }: OutputSectionProps) {
  const [activeTab, setActiveTab] = useState<keyof GeneratedOutputs>('envExample');

  const copyToClipboard = async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${label} copied to clipboard!`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const tabs = [
    { key: 'envExample' as const, label: '.env.example', icon: '📄', color: ' from-purple-900/30 to-pink-900/30 border border-purple-500/20 ' },
    { key: 'deploymentChecklist' as const, label: 'Deployment Checklist', icon: '✅', color: 'from-purple-900/30 to-pink-900/30 border border-purple-500/20' },
    { key: 'dockerCompose' as const, label: 'Docker Compose', icon: '🐳', color: 'from-purple-900/30 to-pink-900/30 border border-purple-500/20' },
    { key: 'vercelConfig' as const, label: 'Vercel Config', icon: '▲', color: 'from-purple-900/30 to-pink-900/30 border border-purple-500/20' },
  ];

  // Helper functions for tab descriptions
  const getTabDescription = (tabKey: string) => {
    const descriptions: Record<string, string> = {
      envExample: 'Template file with environment variable keys (no sensitive values). Safe to commit to version control.',
      deploymentChecklist: 'Comprehensive checklist for production deployment across different platforms.',
      dockerCompose: 'Docker Compose configuration with proper environment variable handling.',
      vercelConfig: 'Vercel deployment configuration with optimized environment settings.'
    };
    return descriptions[tabKey] || 'Generated output format for your environment variables';
  };

  const getTabIcon = (tabKey: string) => {
    const icons: Record<string, string> = {
      envExample: '📄',
      deploymentChecklist: '✅',
      dockerCompose: '🐳',
      vercelConfig: '▲'
    };
    return icons[tabKey] || '📋';
  };

  const getTabTitle = (tabKey: string) => {
    const titles: Record<string, string> = {
      envExample: 'Environment Template',
      deploymentChecklist: 'Deployment Guide',
      dockerCompose: 'Docker Configuration',
      vercelConfig: 'Vercel Settings'
    };
    return titles[tabKey] || 'Output Format';
  };

  const getTabTags = (tabKey: string) => {
    const tags: Record<string, string[]> = {
      envExample: ['Version Control', 'Safe to Share', 'Template'],
      deploymentChecklist: ['Production', 'Checklist', 'Best Practices'],
      dockerCompose: ['Container', 'Services', 'Development'],
      vercelConfig: ['Deployment', 'Platform', 'Serverless']
    };
    return tags[tabKey] || ['Generated', 'Configuration'];
  };

  const getFileName = (tabKey: string) => {
    const files: Record<string, string> = {
      envExample: '.env.example',
      deploymentChecklist: 'DEPLOYMENT.md',
      dockerCompose: 'docker-compose.yml',
      vercelConfig: 'vercel.json'
    };
    return files[tabKey] || 'output.txt';
  };
  return (
    <div className="glass-effect rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in">
      <div className="p-10">
        {/* Header */}
        <div className="flex items-center mb-10">
          <div className="relative mr-4">
            <div className="w-12 h-12 from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl blur opacity-30"></div>
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Generated Outputs
            </h3>
            <p className="text-gray-400 mt-1">Select a format to copy or save</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-10 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-purple-900/10 rounded-2xl blur-xl opacity-50"></div>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-7 py-4 rounded-2xl font-semibold transition-all duration-500 flex items-center space-x-3 group/tab ${activeTab === tab.key
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl transform scale-105 z-10`
                  : 'bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 border border-white/10 backdrop-blur-sm'
                }`}
            >
              <div className={`relative ${activeTab === tab.key ? 'text-white' : 'group-hover/tab:scale-110 transition-transform duration-300'}`}>
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <span className="relative">
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"></span>
                )}
              </span>
              {activeTab === tab.key && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Content Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black/40 to-black/20  flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">
                  {tabs.find(t => t.key === activeTab)?.icon}
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white">
                  {tabs.find(t => t.key === activeTab)?.label}
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  {getTabDescription(activeTab)}
                </p>
              </div>
            </div>
            <button
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => copyToClipboard(outputs[activeTab] || '', tabs.find(t => t.key === activeTab)?.label || '')}
              className="relative group/btn px-6 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl blur opacity-0 group-hover/btn:opacity-50 transition-opacity duration-500"></div>
              <span className="relative flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy to Clipboard</span>
                <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>

          {/* Output Content */}
          <div className="relative group/code">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover/code:opacity-30 transition duration-500"></div>
            <div className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    {getFileName(activeTab)}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-400 font-mono">
                    {outputs[activeTab]?.length || 0} characters
                  </span>
                </div>
              </div>
              <pre className="p-8 text-sm text-gray-100 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto bg-gradient-to-b from-transparent to-black/20">
                <code className="relative">
                  {outputs[activeTab]}
                  {!outputs[activeTab] && (
                    <div className="text-gray-500 italic text-center py-12">
                      <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No content available for this format</p>
                    </div>
                  )}
                </code>
              </pre>
            </div>
          </div>

          {/* Tab Description Card */}
          <div className="glass-effect rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 flex items-center justify-center">
                  <span className="text-2xl">{getTabIcon(activeTab)}</span>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-white mb-2">
                  {getTabTitle(activeTab)}
                </h5>
                <p className="text-gray-300 leading-relaxed">
                  {getTabDescription(activeTab)}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {getTabTags(activeTab).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg text-sm text-purple-300 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
