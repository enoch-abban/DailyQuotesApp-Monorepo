import React from "react";
import { IoMdHome, IoMdLogOut } from "react-icons/io";

const HomePage: React.FC = () => {
  const handleLogout = () => {
    console.log("Logged out");
    // TODO: Implement actual logout logic (e.g., clear auth tokens, redirect to AuthPage)
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-[#F8F9FB]">
      <div className="flex items-center gap-4">
        <IoMdHome size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-[#141C24]">Welcome to the Home Page</h1>
      </div>
      <p className="mt-2 text-gray-600">Explore our features and start your journey.</p>
      <button
        onClick={handleLogout}
        className="mt-8 bg-[#F4C753] text-[#141C24] font-bold py-2 px-6 rounded-xl"
      >
        <IoMdLogOut className="inline-block mr-2" />
        Log Out
      </button>
    </div>
  );
};

export default HomePage;