"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import loginImage from "@/public/login.webp";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Staff");

  return (
    <main className="min-h-screen bg-[#faf9f5] md:flex md:items-center md:justify-center md:p-0">
      <div className="flex min-h-screen w-full items-center justify-center flex-col overflow-hidden bg-[#faf9f5] shadow-2xl md:flex-row">
        <section
          className="flex w-full flex-col justify-center bg-[#faf9f5] px-6  md:min-h-screen md:w-1/2 md:px-16 lg:px-24"
          aria-label="Login form"
        >
          <div className="mx-auto flex w-full max-w-md flex-col gap-8 sm:gap-10">
            <header className="relative -top-3 flex flex-col items-center text-center" aria-label="Treasure Counseling Center branding">
              <Image src="/logo.webp" alt="Treasure Counseling Center logo" width={76} height={76} className="mb-2 h-14 w-14 object-contain sm:h-[68px] sm:w-[68px]" priority />
              <h1 className="bg-linear-to-b from-[#f1d28b] via-[#a86d22] to-[#6f3f12] bg-clip-text font-serif text-[2.15rem] font-semibold uppercase leading-none tracking-[0.14em] text-transparent drop-shadow-[0_1px_1px_rgba(93,53,13,0.3)] sm:text-[2.55rem]">Treasure</h1>
              <div className="mt-3 flex w-full items-center gap-3"><span className="h-px flex-1 bg-linear-to-r from-transparent to-[#b78648]" /><span className="h-2.5 w-2.5 rotate-45 bg-[#2D5A3F]" /><span className="h-px flex-1 bg-linear-to-l from-transparent to-[#b78648]" /></div>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#2D5A3F] sm:text-xs">For the people who need help</p>
            </header>
            <div className="flex justify-center">
              <div className="inline-flex gap-1 rounded-full bg-gray-100 p-1">
                {["Staff", "Admin"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition ${role === item ? "bg-[#2D5A3F] text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <form
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                router.push("/dashboard");
              }}
            >
              <label className="group relative flex items-center border-b border-gray-300 pb-2 transition-colors focus-within:border-[#5e8753]">
                <FiMail className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                <input
                  className="w-full border-0 bg-transparent py-2 text-gray-800 outline-none placeholder:text-gray-500 focus:ring-0"
                  name="email"
                  placeholder="Email or Phone Number"
                  type="text"
                  autoComplete="email"
                />
              </label>
              <label className="group relative flex items-center border-b border-gray-300 pb-2 transition-colors focus-within:border-[#5e8753]">
                <FiLock className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                <input
                  className="w-full border-0 bg-transparent py-2 text-gray-800 outline-none placeholder:text-gray-500 focus:ring-0"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </label>
              <div className="flex items-center justify-between pt-2 text-sm text-gray-600">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#5e8753] accent-[#5e8753]"
                    type="checkbox"
                    defaultChecked
                  />
                  Remember me
                </label>
                <a
                  className="font-medium text-gray-800 underline decoration-gray-400 underline-offset-2 transition hover:text-[#5e8753]"
                  href="#forgot"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                className="mt-2 flex w-full justify-center  rounded-md bg-[#2D5A3F] px-4 py-4 text-lg font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#16482b] focus:outline-none focus:ring-2 focus:ring-[##2D5A3F] focus:ring-offset-2"
                type="submit"
              >
                Log In
              </button>
            </form>
          </div>
        </section>
        <section
          className="relative hidden min-h-screen w-1/2 bg-gray-50 md:block"
          aria-label="Mental health awareness illustration"
        >
          <div className="absolute inset-0 z-10 bg-black/5" />
          <Image
            fill
            priority
            sizes="50vw"
            alt="Mental Health Awareness Illustration"
            className="h-full w-full object-cover object-center"
            src={loginImage}
          />
        </section>
      </div>
    </main>
  );
}
