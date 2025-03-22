import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, LoaderCircle, Lock } from 'lucide-react';

const ChangePassword = () => {
  const { authUser, changePassword, isUpdating } = useAuthStore();
  const [password, setPassword] = useState({
    password1: "",
    password2: ""
  });
  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false
  });
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLowerCase && hasUpperCase && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.password1 || !password.password2) {
      setError("Oba pola muszą być wypełnione");
    } else if (password.password1 !== password.password2) {
      setError("Oba pola muszą zawierać to samo hasło");
    } else if (!validatePassword(password.password1)) {
      setError("Hasło musi zawierać przynajmniej jedną małą literę, jedną wielką literę i jeden znak specjalny.");
    } else {
      setError("");
      changePassword(authUser.id, password.password1);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-violet-700 to-blue-800 w-full flex items-center justify-center sm:p-5 md:p-15">
      <div className="bg-white w-full p-5 rounded-2xl flex flex-col shadow-2xl m-1 sm:w-2xl">
        <div className="w-full flex flex-col gap-3 justify-center items-center">
          <p className="font-bold text-xl">Ustaw nowe hasło</p>
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="w-full relative">
              <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                <span className="font-medium">Hasło</span>
              </label>
              <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="size-5 text-black/70 z-10" />
                </div>
                <input
                  type={showPassword.password1 ? "text" : "password"}
                  className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                  placeholder="••••••"
                  value={password.password1}
                  onChange={(e) => setPassword({ ...password, password1: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword({ ...showPassword, password1: !showPassword.password1 })}
                  title={!showPassword.password1 ? 'Pokaż hasło' : 'Ukryj hasło'}
                >
                  {showPassword.password1 ? (
                    <EyeOff className="size-5 text-base-content/70" />
                  ) : (
                    <Eye className="size-5 text-base-content/70" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full relative">
              <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                <span className="font-medium">Powtórz hasło</span>
              </label>
              <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="size-5 text-black/70 z-10" />
                </div>
                <input
                  type={showPassword.password2 ? "text" : "password"}
                  className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                  placeholder="••••••"
                  value={password.password2}
                  onChange={(e) => setPassword({ ...password, password2: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword({ ...showPassword, password2: !showPassword.password2 })}
                  title={!showPassword.password2 ? 'Pokaż hasło' : 'Ukryj hasło'}
                >
                  {showPassword.password2 ? (
                    <EyeOff className="size-5 text-base-content/70" />
                  ) : (
                    <Eye className="size-5 text-base-content/70" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
              disabled={isUpdating}
              title="Zapisz"
            >
              {isUpdating ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                "Zapisz"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
