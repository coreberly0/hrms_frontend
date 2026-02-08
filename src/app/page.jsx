"use client";
import LoginPage from "./(auth)/login/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="">
        <LoginPage />
      </div>
    </div>
  );
}
