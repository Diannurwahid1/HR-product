"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { showSuccess, showError } from "../utils/alerts";

interface LoginFormProps {
  onLogin?: (credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<void>;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email wajib diisi";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Format email tidak valid";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "Password wajib diisi";
    }
    if (password.length < 6) {
      return "Password minimal 6 karakter";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with real-time validation
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear general error
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (onLogin) {
        await onLogin(formData);
      }
    } catch (error: any) {
      setErrors({
        general:
          error.message || "Login gagal. Periksa kembali kredensial Anda.",
      });
      showError(
        error.message || "Login gagal. Periksa kembali kredensial Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (email: string) => {
    if (!validateEmail(email)) {
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSuccessMessage("Link reset password telah dikirim ke email Anda");
        showSuccess("Link reset password berhasil dikirim!");
        setShowForgotPassword(false);
      } catch (error) {
        showError("Gagal mengirim link reset password");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100 mb-2">
            Richz-HR
          </h1>
          <p className="text-gray-600 dark:text-dark-400">
            Sistem Manajemen HR Professional
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-200 dark:border-dark-600 p-8 transition-all duration-300">
          {!showForgotPassword ? (
            <>
              {/* Form Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100 mb-2">
                  Masuk ke Akun Anda
                </h2>
                <p className="text-gray-600 dark:text-dark-400 text-sm">
                  Silakan masukkan kredensial Anda untuk melanjutkan
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2 animate-in slide-in-from-top-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300 text-sm">
                    {successMessage}
                  </span>
                </div>
              )}

              {/* General Error Message */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300 text-sm">
                    {errors.general}
                  </span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400 dark:text-dark-500" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="admin@rockscompany.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-400 dark:placeholder-dark-500 ${
                        errors.email
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-dark-600 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400 dark:text-dark-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Masukkan password Anda"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-400 dark:placeholder-dark-500 ${
                        errors.password
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-dark-600 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        handleInputChange("rememberMe", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-dark-700 border-gray-300 dark:border-dark-600 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700 dark:text-dark-300">
                      Ingat saya
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    disabled={isLoading}
                  >
                    Lupa password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Masuk ke Dashboard</span>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                  Demo Credentials:
                </p>
                <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <p>
                    <strong>Email:</strong> admin@rockscompany.com
                  </p>
                  <p>
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Forgot Password Form */
            <ForgotPasswordForm
              onBack={() => setShowForgotPassword(false)}
              onSubmit={handleForgotPassword}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-dark-400">
            © 2024 Richz-HR. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
};

// Forgot Password Component
interface ForgotPasswordFormProps {
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email wajib diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setError("");
    await onSubmit(email);
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 dark:text-dark-400 text-sm">
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-4 h-4 text-gray-400 dark:text-dark-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="Masukkan email Anda"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-400 dark:placeholder-dark-500 ${
                error
                  ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-dark-600 focus:ring-blue-500 focus:border-blue-500"
              }`}
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{error}</span>
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-dark-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <span>Kirim Link Reset</span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
