import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.scss";
import LoginPage from "./pages/LogInPage";
import SignUpPage from "./pages/SingUpPage";
import BoardPage from "./pages/BoardPage";
import Header from "./components/Header";
import BoardDetailPage from "./pages/BoardDetailPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/boards" element={<BoardPage />} />
        <Route path="/board/detail/:id" element={<BoardDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
