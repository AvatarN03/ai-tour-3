"use client";

import { useState } from "react";
import { googleLoginAction } from "@/actions/auth/googleLogin";
import { emailSignInAction, emailRegisterAction } from "@/actions/auth/emailAuth";
import { checkUsernameAction } from "@/actions/user/checkUsername";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsync = async (fn) => {
    setLoading(true);
    setError("");
    const res = await fn();
    if (!res.success) setError(res.error || "Something went wrong");
    setLoading(false);
    return res;
  };

  /** Google OAuth sign-in */
  const googleLogin = () => handleAsync(() => googleLoginAction());

  /** Email sign-in */
  const emailSignIn = ({ email, password }) =>
    handleAsync(() => emailSignInAction({ email, password }));

  /** Email registration with username + preferences */
  const emailRegister = ({ email, password, name, username, avatarUrl, preferences }) =>
    handleAsync(() => emailRegisterAction({ email, password, name, username, avatarUrl, preferences }));

  /** Check username availability */
  const checkUsername = async (username) => {
    const res = await checkUsernameAction({ username });
    return res;
  };

  return { googleLogin, emailSignIn, emailRegister, checkUsername, loading, error, setError };
};
