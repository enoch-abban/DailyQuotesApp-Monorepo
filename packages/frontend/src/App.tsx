// import { QueryPayload } from '@dqa/shared-data';
// import LoginPage from './pages/LoginPage';
// import Button from './components/Button';
// import SignUpPage from './pages/SignUpPage';

// function App() {
//   return (
//     <div className="App">
//       {/* <DarkMode /> */}
//       {/* <LoginPage /> */}
//       <SignUpPage />
//       { /* NEW Example to call endpoints */ }
//         {/* <Button text="GET SOME DATA" onClick={() => {
//             fetch("http://localhost:3001/", {})
//               .then((response) => response.json())
//               .then((data: QueryPayload) => console.log(data.payload));
//           }} variant="primary" /> */}
      
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;