import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthPage = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div 
    className="flex flex-col h-screen items-center justify-center bg-[#F8F9FB]"
    >
      {isLogin ? (
        <LoginPage />
      ) : (
        <SignUpPage />
      )}
      <div className="flex flex-col h-screen items-center">
      <button
        onClick={toggleAuthPage}
        className="mt-4 text-blue-600 underline"
        type="button"
      >
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
      </button>
      </div>
      
    </div>
  );
};

export default AuthPage;