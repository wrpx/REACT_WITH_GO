///LoginForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../service/apiService";
import useAuthStore from "../../store/useAuthStore";
import "./LoginForm.css";

const LoginForm = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    if (!showMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const showMessageWithTimeout = (message, isSuccess) => {
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
      await apiService.login({
        username: loginUsername,
        password: loginPassword,
      });
      login();
      navigate("/products");
    } catch (error) {
      showMessageWithTimeout(error.message, false);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await apiService.register({
        username: signupUsername,
        password: signupPassword,
      });
      showMessageWithTimeout(response, true);
      setSignupUsername("");
      setSignupPassword("");
    } catch (error) {
      showMessageWithTimeout(error.message, false);
    }
  };

  const handleSubmit = (event, isLogin) => {
    event.preventDefault();
    setError("");
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };



  return (
    <>
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
                placeholder="Username"
                required
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
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
                placeholder="Username"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
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
    </>
  );
};

export default LoginForm;


export const MessageAlert = ({ message, isError, show }) => (
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

