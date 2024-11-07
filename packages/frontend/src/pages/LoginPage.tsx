import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { IoIosArrowRoundBack, IoMdArrowRoundBack } from "react-icons/io";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // const target = e.target as typeof e.target & {
    //   email: { value: string };
    //   password: { value: string };
    // };
    // console.log("Target", target.email.value, target.password.value);
    console.log("Logging in with:", { email, password });

    //TODO: Acces backend api
  };

  return (
    <div
      className="flex flex-col h-screen bg-[#F8F9FB] items-center justify-center overflow-hidden"
      style={{ fontFamily: 'Epilogue, "Noto Sans", sans-serif' }}
    >

      <div className="flex items-center p-4 pb-2 w-full justify-between ">
        <div
          className="text-[#141C24] flex items-center cursor-pointer"
          onClick={() => console.log("Back")}
        >
          <div className="text-4xl"><IoIosArrowRoundBack  /></div>
        </div>
        <h2 className="text-[#141C24] text-lg font-bold flex-1 text-center pr-12">
          Log in
        </h2>
      </div>

      <h1 className="text-[#141C24] text-[22px] font-bold text-center py-5">
        Welcome back
      </h1>

      <form onSubmit={handleLogin} className="items-center w-full flex justify-center  flex-col">
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
            autocomplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-1 w-full max-w-[480px] flex-col items-stretch px-4 py-3">
          <Button text="Log in" variant="primary" />
        </div>
      </form>
      <div className="flex flex-1 w-full max-w-[480px] flex-col items-stretch px-4 py-3">
        <Button
          text="Forgot Password?"
          onClick={() => console.log("Forgot Password")}
          variant="secondary"
        />
      </div>

      <p className="text-[#3F5374] text-sm text-center py-3 px-4">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>

    // <div className="w-full h-screen overflow-hidden">
    //   <div className="w-full flex flex-col justify-center p-5">
    //     {/* header */}
    //     <div className="w-full  flex justify-between items-center gap-2">
    //       <div className="text-base"><IoIosArrowRoundBack  /></div>
    //       <div>
    //         <p>Login</p>
    //       </div>
    //       <div></div>
    //     </div>
    //     <h1 className="text-[#141C24] text-[22px] font-bold text-center py-5">
    //      Welcome back
    //    </h1>
    //   </div>
    //   <div className="flex flex-1 w-full max-w-[480px] flex-col items-stretch px-4 py-3">
    //   <Button
    //       text="Forgot Password?"
    //       onClick={() => console.log("Forgot Password")}
    //       variant="secondary"
    //     />
    //   </div>
    // </div>
  );
};

export default LoginPage;
