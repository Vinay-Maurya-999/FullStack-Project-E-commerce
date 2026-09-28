import { useState } from "react";
import { useForm } from "react-hook-form";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, CircleCheckBig } from "lucide-react";
import { useNavigate } from "react-router";
import useApi from "../config/api";
import { useAppContext } from "../Context/AuthContextValue";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [Login, setLogin] = useState(false);

  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const api = useApi();
  const { setAccessToken, setUser } = useAppContext();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      setAccessToken(res.data.data.AccessToken);
      setUser(res.data.data.user);
      setLogin(true);

      navigate("/shop");
    } catch (error) {
      console.log(error);
    }
  };

  const inputBase =
    "w-full bg-white dark:bg-zinc-800/60 border rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:ring-2 transition";

  const inputOk =
    "border-zinc-300 dark:border-zinc-700 focus:ring-lime-400/60 focus:border-lime-400/60";
  const inputErr = "border-red-500/70 focus:ring-red-500/50 focus:border-red-500/70";

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950  flex flex-col lg:flex-row">
      {/* Left side — marketing panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 lg:border-r border-zinc-800">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 lg:mb-16">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lime-400">
            <Zap className="w-5 h-5 text-zinc-950" fill="currentColor" />
          </span>
          <span className="text-2xl font-bold text-zinc-900 dark:text-white">
            Sky<span className="text-lime-600 dark:text-lime-400">Mart</span>
          </span>
        </div>

        <p className="text-lime-600 dark:text-lime-40 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4">
          Welcome back
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-2">
          Shop the future.
        </h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-lime-600 dark:text-lime-400 leading-tight mb-6">
          Today.
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-md mb-10">
          Thousands of products, lightning-fast delivery, and prices that make your wallet happy.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
          {[
            { value: "20K+", label: "Products" },
            { value: "50K+", label: "Users" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-zinc-200 dark:border-zinc-700 rounded-xl py-4 sm:py-5 text-center"
            >
              <p className="text-lime-600 dark:text-lime-400 text-xl sm:text-2xl font-extrabold">
                {stat.value}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — sign in form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-1">
            Sign in
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Enter your credentials to continue
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            // noValidate
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="Email address"
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${inputBase} pr-11 ${errors.password ? inputErr : inputOk}`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((Prev) => !Prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 active:bg-lime-500 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl py-3 mt-2 transition"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/register", { replace: true })}
              href="#"
              className="text-lime-600 dark:text-lime-400 font-semibold hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
      {Login ? (
        <div className="fixed top-5 right-5 z-50">
          <p className="flex items-center gap-6 bg-lime-400/10 border border-lime-500/30 text-lime-600 dark:text-lime-400 text-sm font-medium px-4 py-3 rounded-xl">
            Login successfully
            <span>
              <CircleCheckBig className="w-4 h-4" />
            </span>
          </p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
