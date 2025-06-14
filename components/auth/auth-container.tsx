"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

export function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("careerBridgeAIToken");
    // check if user is already logged in
    // If token exists, redirect to dashboard

    if (token) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col space-y-4 items-center justify-center p-4">
      <h1 className="text-lg md:text-2xl lg:text-3xl mb-6 font-bold text-gray-800 text-center">
        Welcome to CareerBridgeAi Platform
      </h1>
      <div className="w-full max-w-md">
        <div className="transition-all duration-1000 ease-in-out">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <SignupForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>
    </div>
  );
}
