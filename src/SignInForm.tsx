"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="space-y-5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <input
              className="relative w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-400 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 backdrop-blur-sm"
              type="email"
              name="email"
              placeholder="Email address"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <input
              className="relative w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-400 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 backdrop-blur-sm"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          className={`relative group w-full py-3 px-4bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95 ${submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          type="submit"
          disabled={submitting}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
          <span className="relative flex items-center justify-center">
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {flow === "signIn" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {flow === "signIn" ? "Sign in" : "Sign up"}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>

        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">
            <span>
              {flow === "signIn"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              className="relative font-medium cursor-pointer group/switch"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {flow === "signIn" ? "Create one" : "Sign in instead"}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-pink-400 group-hover/switch:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-black/40 text-gray-400 backdrop-blur-sm rounded-full border border-white/10 py-1">
            <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Quick access
          </span>
        </div>
      </div>

      <button
        className="relative group w-full py-3 px-4 bg-black/40 border border-white/10 hover:border-purple-500/30 text-gray-200 font-medium rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95 backdrop-blur-sm"
        onClick={() => void signIn("anonymous")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span className="relative flex items-center justify-center">
          <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Continue as Guest
          <svg className="ml-2 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </button>

      <div className="mt-8 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/10">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-purple-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-gray-400">
            <p className="font-medium text-purple-300 mb-1">Privacy First</p>
            <p>Your data stays in your browser. No tracking, no storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
