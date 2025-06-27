import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, LoaderCircle, Lock, CheckCircle2, XCircle } from 'lucide-react';

const passwordRules = [
  { key: 'length', label: 'Min. 8 znaków', test: pwd => pwd.length >= 8 },
  { key: 'lower',  label: 'Min. jedna mała litera', test: pwd => /[a-z]/.test(pwd) },
  { key: 'upper',  label: 'Min. jedna wielka litera', test: pwd => /[A-Z]/.test(pwd) },
  { key: 'number', label: 'Min. jedna cyfra',        test: pwd => /\d/.test(pwd) },
  { key: 'special',label: 'Min. jeden znak specjalny (!@#$...)', test: pwd => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

const ChangePassword = () => {
  const navigate = useNavigate();
  const { authUser, changePassword, isUpdating } = useAuthStore();
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newErr = {};
    passwordRules.forEach(rule => {
      if (!rule.test(password1)) newErr[rule.key] = rule.label;
    });
    if (password2 && password1 !== password2) {
      newErr.match = 'Hasła muszą być takie same';
    }
    setErrors(newErr);
  }, [password1, password2]);

  const canSubmit = 
    passwordRules.every(r => r.test(password1)) && 
    password1 === password2 && 
    !isUpdating;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await changePassword(authUser.id, password1);
      setPassword1('');
      setPassword2('');
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-violet-700 to-blue-800 w-full flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Ustaw nowe hasło</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={show1 ? 'text' : 'password'}
              placeholder="Nowe hasło"
              value={password1}
              onChange={e => setPassword1(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShow1(!show1)}
              title={show1 ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {show1 ? <Eye /> : <EyeOff />}
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={show2 ? 'text' : 'password'}
              placeholder="Powtórz hasło"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShow2(!show2)}
              title={show2 ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {show2 ? <Eye /> : <EyeOff />}
            </div>
          </div>

          <ul className="mb-4 space-y-1">
            {passwordRules.map(rule => {
              const ok = rule.test(password1);
              return (
                <li key={rule.key} className="flex items-center text-sm">
                  {ok ? (
                    <CheckCircle2 className="text-green-500 mr-2" />
                  ) : (
                    <XCircle className="text-red-500 mr-2" />
                  )}
                  <span className={ok ? 'text-gray-700' : 'text-gray-400'}>
                    {rule.label}
                  </span>
                </li>
              );
            })}
            {errors.match && (
              <li className="flex items-center text-sm text-red-500">
                <XCircle className="mr-2" />{errors.match}
              </li>
            )}
          </ul>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 rounded-lg text-white font-bold transition-colors cursor-pointer flex flex-row items-center justify-center 
              ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {isUpdating ? (
              <><LoaderCircle className="animate-spin mr-2" />Zmiana... </>
            ) : (
              'Zmień hasło'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;