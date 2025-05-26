"use client";
import React, { useContext, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { AuthContext } from '@/Context/AuthContext';

interface FormData {
  accountNumber: string;
  password: string;
}

interface FormError {
  accountNumber: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [hasMounted, setHasMounted] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    accountNumber: '',
    password: '',
  });
  const [error, setError] = useState<FormError>({
    accountNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError({ accountNumber: '', password: '' });

    setTimeout(async () => {
      let formValid = true;
      const newErrors: FormError = { accountNumber: '', password: '' };

      if (!formData.accountNumber) {
        newErrors.accountNumber = 'Please fill in the account number';
        formValid = false;
      }
      if (!formData.password) {
        newErrors.password = 'Please fill in the password';
        formValid = false;
      }

      if (!formValid) {
        setError(newErrors);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
          
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.accountNumber,
              password: formData.password,
            }),
          }
        );

        let data: { token?: string; message?: string };

        try {
          data = await response.json();
        } catch {
          data = { message: await response.text() };
        }

        if (!response.ok || !data.token) {
          setError({ ...newErrors, password: data.message || "Invalid credentials" });
          setLoading(false);
          return;
        }

        // Only store the token, not user
        authContext?.login(data.token);
        window.location.href = "/";
      } catch {
        setError({ ...newErrors, accountNumber: "Login failed" });
        setLoading(false);
      }
    }, 1000);
  };


  if (!hasMounted) {
    return null;
  }

  if (localStorage.getItem("token")) {
    return null;
  }

  return (
    <main className="flex items-center justify-center h-screen gap-5 p-5">
      <div className="w-full max-w-[600px] bg-black-300 p-3 lg:p-10 rounded-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <a href="/">
            <img src="/logo.png" alt="site_logo" className="w-[240px]" />
          </a>
        </div>

        <div className="my-4">
          <h3 className="text-3xl text-center text-white">Trade Login</h3>
          <p className="pt-4 text-sm text-center text-white text-opacity-40">
            Enter your account number and password to log in to the trading platform
          </p>
        </div>

        <div className="border-t border-gray-700 my-4"></div>

     
        <form className="my-4 space-y-4" onSubmit={handleSubmit}>
        
          <div>
            <div
              className={
                error.accountNumber
                  ? 'relative w-full px-4 py-3 border border-red-400 bg-bodyBg rounded-xl'
                  : 'relative w-full px-4 py-3 border border-white bg-bodyBg rounded-xl'
              }
            >
              <input
                type="text"
                name="accountNumber"
                onChange={handleChange}
                value={formData.accountNumber}
                placeholder="Account Number"
                className="w-full text-sm text-white bg-transparent border-none outline-none focus:border-transparent focus:ring-0 placeholder:text-opacity-50 font-candor-medium"
              />
              <div className="absolute -translate-y-1/2 top-1/2 right-4">
                <img src="/Images/Icons/mail-icon.svg" alt="mail_icon" />
              </div>
            </div>

            {error.accountNumber && (
              <p className="text-red-500 text-start ml-1 text-sm">{error.accountNumber}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div
              className={
                error.password
                  ? 'relative w-full px-4 py-3 border border-red-400 bg-bodyBg rounded-xl'
                  : 'relative w-full px-4 py-3 border border-white bg-bodyBg rounded-xl'
              }
            >
              <input
                type={isVisible ? "text" : "password"}
                onChange={handleChange}
                name="password"
                value={formData.password}
                placeholder="Password"
                className="w-full text-sm text-white bg-transparent border-none outline-none focus:border-transparent focus:ring-0 placeholder:text-opacity-50 font-candor-medium appearance-none"
              />
              
              <div
                onClick={() => setIsVisible(!isVisible)}
                className="absolute -translate-y-1/2 top-1/2 right-4 cursor-pointer"
                role="button"
                aria-label={isVisible ? "Hide password" : "Show password"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsVisible(!isVisible);
                  }
                }}
              >
                <img src="/Images/Icons/eye-slash.svg" alt="eye_icon" />
              </div>
            </div>

            {error.password && (
              <p className="text-red-500 ml-1 text-sm text-start">{error.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-4 text-base text-white duration-200 bg-violet-700 rounded-xl font-candor-medium active:scale-95"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;