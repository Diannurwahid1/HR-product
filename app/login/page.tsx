"use client";

import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const handleLogin = async (credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        // Lempar error agar bisa ditangkap LoginForm
        throw new Error(data.error || "Login gagal");
      }
      // Simpan JWT ke localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        // Set cookie untuk middleware
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      }
      // Sukses login, redirect
      window.location.href = "/dashboard";
    } catch (error: any) {
      // Lempar error ke LoginForm agar bisa tampil di UI
      throw error;
    }
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default LoginPage;
