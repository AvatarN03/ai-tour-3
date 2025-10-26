"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Upload,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import ThemeToggle from "@/components/custom/ThemeToggle";
import { availablePreferences } from "@/lib/constant";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/useAuth";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatarUrl: "",
    preferences: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const continueTo = useSearchParams().get("continueTo");
  const {user} = useAuth()

  useEffect(()=>{
    if(user)
    {
      router.push(continueTo || "/");
    }
  },[]) 


  const updateForm = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const togglePreference = (pref) =>
    updateForm(
      "preferences",
      formData.preferences.includes(pref)
        ? formData.preferences.filter((p) => p !== pref)
        : [...formData.preferences, pref]
    );


  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || "NA",
          avatarUrl: result.user.photoURL || "",
          preferences: [],
          createdAt: new Date(),
        },
        { merge: true }
      );
      toast.success("Signed in successfully!");
      router.push(continueTo || "/");
    } catch (error) {
      setError(error.message);
      toast.error("Error logging in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isLogin && !formData.name) {
      toast.error("Please enter your full name");
      return;
    }

    if (!isLogin && formData.preferences.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = isLogin
        ? await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          )
        : await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );

      if (!isLogin) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: formData.name,
          avatarUrl: formData.avatarUrl,
          preferences: formData.preferences,
          createdAt: new Date(),
        });
        toast.success("Account created successfully!");
      } else {
        toast.success("Signed in successfully!");
      }

      router.push(continueTo || "/");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      avatarUrl: "",
      preferences: [],
    });
  };

  const PreferencesSection = ({ isMobile }) => (
    <div>
      <Label className="text-sm font-semibold mb-3 block">
        Your Interests{" "}
        <span className="text-gray-400 text-xs">(select at least 3)</span>
        {!isLogin && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {isMobile ? (
        <>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 flex items-center justify-between hover:border-purple-400 transition-all"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {formData.preferences.length > 0
                ? `${formData.preferences.length} interest${
                    formData.preferences.length !== 1 ? "s" : ""
                  } selected`
                : "Select your interests"}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showDropdown && (
            <div className="mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2">
              {availablePreferences.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
                    formData.preferences.includes(pref)
                      ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{pref}</span>
                    {formData.preferences.includes(pref) && <span>✓</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {formData.preferences.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.preferences.map((pref) => (
                <span
                  key={pref}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs font-medium rounded-full"
                >
                  {pref}
                  <button
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {availablePreferences.map((pref) => (
            <button
              key={pref}
              type="button"
              onClick={() => togglePreference(pref)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                formData.preferences.includes(pref)
                  ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-lg"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400"
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      )}
      {formData.preferences.length > 0 && !isMobile && (
        <p className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium">
          ✓ {formData.preferences.length} interest
          {formData.preferences.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 to-purple-500 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex max-w-7xl w-full h-[90vh] bg-slate-50 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex-1 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative z-10 text-center max-w-md">
            <Link
              href="/"
              className="w-24 h-24 bg-white/20 rounded-3xl mx-auto mb-8 flex items-center justify-center backdrop-blur-md shadow-lg rotate-3 hover:rotate-6 transition-transform"
            >
              <Sparkles className="w-12 h-12" />
            </Link>
            <h1 className="text-4xl font-bold mb-4">
              {isLogin ? "Welcome Back!" : "Join Our Community"}
            </h1>
            <p className="text-purple-100 text-lg mb-8">
              {isLogin
                ? "We've missed you. Sign in to continue your journey."
                : "Let's get you started on an amazing journey."}
            </p>
            {[
              "Personalized experiences",
              "Secure and private",
              "Join thousands of users",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-purple-100 text-sm mb-4"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-12 overflow-y-auto scrollbar-gradient">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-start gap-3">
              <div>⚠️</div>
              <div>{error}</div>
            </div>
          )}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in your details to get started"}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

              
                <PreferencesSection isMobile={false} />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r cursor-pointer from-violet-600 via-purple-600 to-fuchsia-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-200 dark:hover:shadow-purple-900/50 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline font-semibold text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up →"
                : "Already have an account? Sign in →"}
            </button>
          </div>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden max-w-3xl w-full">
        <div className="bg-white/95 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-4 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative z-10">
              <Link
                href="/"
                className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-md shadow-lg rotate-3 hover:rotate-6 transition-transform"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </Link>
              <h1 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back!" : "Join Our Community"}
              </h1>
              <p className="text-purple-100 text-lg">
                {isLogin ? "We've missed you" : "Let's get you started"}
              </p>
            </div>
          </div>

          <div className="p-4 pt-8 ">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg text-sm flex gap-3">
                <div>⚠️</div>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email-mobile" className="text-sm font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email-mobile"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password-mobile"
                  className="text-sm font-semibold"
                >
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password-mobile"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="pl-10 pr-10 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name-mobile"
                      className="text-sm font-semibold"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name-mobile"
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>


                  <PreferencesSection isMobile={true} />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up →"
                  : "Already have an account? Sign in →"}
              </button>
            </div>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
