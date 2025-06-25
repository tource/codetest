import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <header className="main-header">
      <nav className="header-nav">
        <Link to="/boards" className="logo">
          Board
        </Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="login-button">
            로그아웃
          </button>
        ) : location.pathname !== "/login" ? (
          <Link to="/login" className="login-button">
            로그인
          </Link>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;
