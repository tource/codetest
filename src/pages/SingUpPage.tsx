import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const SignUpPage = () => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (pw: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!%*#?&]{8,}$/.test(pw);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, name, password, confirmPassword } = form;

    if (!isEmail(username)) return setError("유효한 이메일을 입력해주세요.");
    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (!isValidPassword(password))
      return setError(
        "비밀번호는 8자 이상, 영문자+숫자+특수문자 조합이어야 합니다."
      );
    if (password !== confirmPassword)
      return setError("비밀번호가 일치하지 않습니다.");

    try {
      const response = await api.post("/auth/signup", {
        username,
        name,
        password,
        confirmPassword,
      });

      if (response.status === 200) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        alert(response.data?.message || "회원가입에 실패했습니다.");
      }
    } catch (err: any) {
      const data = err.response?.data;
      let message = "회원가입에 실패했습니다.";

      if (data) {
        if (data.username?.[0]) message = data.username[0];
        else if (data.password?.[0]) message = data.password[0];
        else if (data.name?.[0]) message = data.name[0];
        else if (typeof data === "string") message = data;
      }

      alert(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">회원가입</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="username"
            placeholder="이메일"
            value={form.username}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
            className="auth-input"
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
