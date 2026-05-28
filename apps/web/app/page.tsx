"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "~/hooks/api/auth";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user && user?.id) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center text-white bg-neutral-900 ">
      <div>
        <h1 className="text-3xl">Typeform - Japanese style</h1>
        <div>{JSON.stringify(user, null, 2)}</div>
      </div>
    </main>
  );
}
