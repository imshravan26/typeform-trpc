import { api } from "~/trpc/server";

export default async function Home() {
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center text-white bg-neutral-900 ">
      <div>
        <h1 className="text-3xl">Typeform - Japanese style</h1>
      </div>
    </main>
  );
}
