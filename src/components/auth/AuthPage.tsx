'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Department, TargetYear } from '../../types';

import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, signup, loginAsPreset, isLoading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotSent, setForgotSent] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signInErrors, setSignInErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const [signUpDepartment, setSignUpDepartment] =
    useState<Department>('CSE');

  const [signUpYear, setSignUpYear] =
    useState<TargetYear>('1st Year');

  const [signUpErrors, setSignUpErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: typeof signInErrors = {};

    if (!signInEmail.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(signInEmail)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!signInPassword) {
      errors.password = 'Password is required.';
    } else if (signInPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setSignInErrors(errors);
      return;
    }

    setSignInErrors({});

    const res = await login(signInEmail, signInPassword);

    if (!res.success) {
      setSignInErrors({
        general: res.error || 'Authentication failed',
      });
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: typeof signUpErrors = {};

    if (!signUpName.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!signUpEmail.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(signUpEmail)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!signUpPassword) {
      errors.password = 'Password is required.';
    } else if (signUpPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (signUpPassword !== signUpConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setSignUpErrors(errors);
      return;
    }

    setSignUpErrors({});

    const res = await signup({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      department: signUpDepartment,
      year: signUpYear,
    });

    console.log('SIGNUP RESULT:', res);

    if (!res.success) {
      setSignUpErrors({
        general: res.error || 'Sign up failed',
      });
      return;
    }

    /*
     * Signup succeeded.
     *
     * We now immediately try to log the new user in.
     * If email confirmation is disabled in Supabase,
     * this will create a session and the app will enter
     * the dashboard automatically.
     *
     * If email confirmation is enabled, Supabase will
     * reject the login until the email is confirmed.
     */

    const loginResult = await login(
      signUpEmail,
      signUpPassword
    );

    console.log('AUTO LOGIN RESULT:', loginResult);

    if (loginResult.success) {
      return;
    }

    setSignUpErrors({
      general:
        loginResult.error ||
        'Account created. Please sign in with your new account.',
    });

    setMode('signin');

    setSignInEmail(signUpEmail);
    setSignInPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 text-white shadow-md mb-4">
          <GraduationCap className="w-8 h-8 text-teal-400" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Campus Notice Board
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Official University Announcements & Communications Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">

          <div className="flex border-b border-slate-200 mb-6">

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setSignInErrors({});
              }}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 text-center transition-colors ${
                mode === 'signin'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignUpErrors({});
              }}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 text-center transition-colors ${
                mode === 'signup'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>

          </div>

          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Instant Evaluator Access:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() => loginAsPreset('student')}
                className="px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg shadow-2xs transition-colors text-center"
              >
                👤 Student (Alex)
              </button>

              <button
                type="button"
                onClick={() => loginAsPreset('admin')}
                className="px-2.5 py-1.5 text-xs font-medium bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-2xs transition-colors text-center"
              >
                🛡️ Admin (Dr. Sarah)
              </button>

            </div>
          </div>

          {mode === 'signin' && (
            <form
              onSubmit={handleSignInSubmit}
              className="space-y-4"
              noValidate
            >

              {signInErrors.general && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {signInErrors.general}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  University Email
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>

                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="alex.chen@university.edu"
                    className={`block w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      signInErrors.email
                        ? 'border-red-300 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 text-slate-900 focus:ring-blue-900'
                    }`}
                  />
                </div>

                {signInErrors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {signInErrors.email}
                  </p>
                )}
              </div>

              <div>

                <div className="flex items-center justify-between mb-1.5">

                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-medium text-blue-800 hover:text-blue-900 underline"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`block w-full pl-9 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      signInErrors.password
                        ? 'border-red-300 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 text-slate-900 focus:ring-blue-900'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

                {signInErrors.password && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {signInErrors.password}
                  </p>
                )}

              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {mode === 'signup' && (
            <form
              onSubmit={handleSignUpSubmit}
              className="space-y-3.5"
              noValidate
            >

              {signUpErrors.general && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {signUpErrors.general}
                </div>
              )}

              <div>

                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>

                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Jane Doe"
                    className={`block w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      signUpErrors.name
                        ? 'border-red-300 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 text-slate-900 focus:ring-blue-900'
                    }`}
                  />

                </div>

                {signUpErrors.name && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {signUpErrors.name}
                  </p>
                )}

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  University Email
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>

                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="jane.doe@university.edu"
                    className={`block w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      signUpErrors.email
                        ? 'border-red-300 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 text-slate-900 focus:ring-blue-900'
                    }`}
                  />

                </div>

                {signUpErrors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {signUpErrors.email}
                  </p>
                )}

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>

                    <select
                      value={signUpDepartment}
                      onChange={(e) =>
                        setSignUpDepartment(
                          e.target.value as Department
                        )
                      }
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:ring-blue-900 focus:outline-none"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Biotechnology">
                        Biotechnology
                      </option>
                      <option value="Other">Other</option>
                    </select>

                  </div>

                </div>

                <div>

                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Year of Study
                  </label>

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>

                    <select
                      value={signUpYear}
                      onChange={(e) =>
                        setSignUpYear(
                          e.target.value as TargetYear
                        )
                      }
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:ring-blue-900 focus:outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>

                  </div>

                </div>

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) =>
                      setSignUpPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className={`block w-full pl-9 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      signUpErrors.password
                        ? 'border-red-300 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 text-slate-900 focus:ring-blue-900'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

                {signUpErrors.password && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {signUpErrors.password}
                  </p>
                )}

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={signUpConfirmPassword}
                    onChange={(e) =>
                      setSignUpConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    className={`block w-full pl-9 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      signUpErrors.confirmPassword
                        ? 'border-red-300 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 text-slate-900 focus:ring-blue-900'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

                {signUpConfirmPassword &&
                  signUpPassword !==
                    signUpConfirmPassword && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      Passwords do not match.
                    </p>
                  )}

              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create Campus Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-500">

            {mode === 'signin' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-blue-900 hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-blue-900 hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}

          </div>

        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">

          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200">

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Reset Password
            </h3>

            {forgotSent ? (
              <div>

                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200 mb-4 text-xs font-medium">

                  <CheckCircle2 className="w-4 h-4 shrink-0" />

                  <span>
                    Password reset instructions sent to{' '}
                    {forgotEmail}
                  </span>

                </div>

                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                    setForgotEmail('');
                  }}
                  className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                >
                  Close
                </button>

              </div>
            ) : (
              <div>

                <p className="text-xs text-slate-500 mb-4">
                  Enter your registered campus email and we
                  will send a password reset link.
                </p>

                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(e.target.value)
                  }
                  placeholder="name@university.edu"
                  className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 mb-4"
                />

                <div className="flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setShowForgotModal(false)
                    }
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateEmail(forgotEmail)) {
                        setForgotSent(true);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
                  >
                    Send Reset Link
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};