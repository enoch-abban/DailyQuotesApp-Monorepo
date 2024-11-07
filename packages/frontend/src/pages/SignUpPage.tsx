import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { IoIosArrowRoundBack } from "react-icons/io";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("Signing up with:", { email, password, confirmPassword });

    //TODO: Access backend API for sign-up
  };

  return (
    <div
      className="items-center justify-center "
      style={{ fontFamily: 'Epilogue, "Noto Sans", sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center p-4 pb-2 w-full justify-between">
        <div
          className="text-[#141C24] flex items-center cursor-pointer"
          onClick={() => console.log("Back")}
        >
          <div className="text-4xl"><IoIosArrowRoundBack /></div>
        </div>
        <h2 className="text-[#141C24] text-lg font-bold flex-1 text-center pr-12">
          Sign Up
        </h2>
      </div>

      <h1 className="text-[#141C24] text-[22px] font-bold text-center py-5">
        Create an Account
      </h1>

      {/* Sign-Up Form */}
      <form onSubmit={handleSignUp} className="items-center w-full flex justify-center flex-col">
        
        {/* Email Input */}
        <div className="flex flex-col w-full max-w-[480px] px-4 py-3">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            autocomplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col w-full max-w-[480px] px-4 py-3">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            autocomplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col w-full max-w-[480px] px-4 py-3">
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            autocomplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Sign Up Button */}
        <div className="flex flex-1 w-full max-w-[480px] flex-col items-stretch px-4 py-3">
          <Button text="Sign Up" variant="primary" />
        </div>
      </form>

      {/* Terms and Privacy */}
      <div className="flex flex-1 w-full max-w-[480px] flex-col items-stretch gap-3 px-4 py-3">
        <p className="text-[#3F5374] text-sm text-center py-3 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;