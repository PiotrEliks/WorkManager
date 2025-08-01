import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, LoaderCircle  } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email === "" || formData.password === "") {
      setError("Wszystkie pola są wymagane!");
    } else {
      setError("");
      login(formData);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-violet-700 to-blue-800 w-full flex items-center justify-center">
      <div className="w-full bg-white m-1 sm:m-5 rounded-3xl sm:w-xl shadow-2xl">
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 py-5 sm:p-2">
          <div className="w-4/5 p-5">
            <img 
              src="/logo.webp" 
              alt="Elektropomiar logo" 
              loading="lazy"
              className="w-full h-full"
              width={48}
              height={48}
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="w-full p-3 sm:p-5">
            <form onSubmit={handleSubmit}  className="space-y-6">
              <div className="w-full relative">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    E-mail
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="size-5 text-gray-400 z-10" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź e-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Hasło
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Lock className="size-5 text-gray-400 z-10" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    title={!showPassword ? 'Pokaż hasło' : 'Ukryj hasło'}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-gray-400" />
                    ) : (
                      <Eye className="size-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-blue-800 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isLoggingIn}
                title="Zaloguj"
              >
                {isLoggingIn ? (
                  <>
                    <LoaderCircle  className="size-5 animate-spin" />
                    Logowanie...
                  </>
                ) : (
                  "Zaloguj"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;