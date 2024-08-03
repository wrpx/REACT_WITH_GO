import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../service/apiService';
import { useAuthStore } from '../../store/useAuthStore';
import './LoginForm.css';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginFormData>({ username: '', password: '' });
  const [signupData, setSignupData] = useState<LoginFormData>({ username: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    if (!showMessage) {
      const timer = setTimeout(() => {
        setError('');
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const showMessageWithTimeout = (message: string, isSuccess: boolean) => {
    if (isSuccess) {
      setSuccessMessage(message);
    } else {
      setError(message);
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  const handleLogin = async () => {
    try {
      const response = await apiService.login(loginData);
      if (response.success) {
        login();
        navigate('/products');
      } else {
        showMessageWithTimeout(response.message || 'Login failed', false);
      }
    } catch (error) {
      showMessageWithTimeout(error instanceof Error ? error.message : 'An error occurred', false);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await apiService.register(signupData);
      if (response.success) {
        showMessageWithTimeout('Registration successful', true);
        setSignupData({ username: '', password: '' });
      } else {
        showMessageWithTimeout(response.message || 'Registration failed', false);
      }
    } catch (error) {
      showMessageWithTimeout(error instanceof Error ? error.message : 'An error occurred', false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, isLogin: boolean) => {
    event.preventDefault();
    setError('');
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, isLogin: boolean) => {
    const { name, value } = event.target;
    if (isLogin) {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  return (
    <div className="login-form-container flex flex-col items-center justify-center">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <label htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={signupData.username}
              onChange={(e) => handleInputChange(e, false)}
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={signupData.password}
              onChange={(e) => handleInputChange(e, false)}
              autoComplete="new-password"
            />
            <button type="submit">Sign up</button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={(e) => handleSubmit(e, true)}>
            <label htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={loginData.username}
              onChange={(e) => handleInputChange(e, true)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={(e) => handleInputChange(e, true)}
              autoComplete="current-password"
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {error && (
        <MessageAlert message={error} isError={true} show={showMessage} />
      )}
      {successMessage && (
        <MessageAlert
          message={successMessage}
          isError={false}
          show={showMessage}
        />
      )}
    </div>
  );
};

export default LoginForm;

interface MessageAlertProps {
  message: string;
  isError: boolean;
  show: boolean;
}

export const MessageAlert: React.FC<MessageAlertProps> = ({ message, isError, show }) => (
  <div className={`flex justify-center ${!show && "fade-out"}`}>
    <div
      className={`alert-message mt-3 text-sm ${
        isError
          ? "text-red-600 bg-red-100 border-l-4 border-red-500"
          : "text-green-600 bg-green-100 border-l-4 border-green-500"
      } p-4 rounded-[10px]`}
    >
      {message}
    </div>
  </div>
);