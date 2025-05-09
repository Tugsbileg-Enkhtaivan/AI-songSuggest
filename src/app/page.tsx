import AISongSearch from "./_components/AISongSearch";
import MoodSearch from "./_components/MoodSearch";
import PromptForm from "./_components/PromptForm";

export default function Home() {
  return (
    <main className="p4">
      <h1 className="text-xl font-bold">Ask GPT-4o-mini</h1>
      <PromptForm />

      {/* <AISongSearch mood="happy" vibe="cinematic" /> */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <MoodSearch />
      </div>
    </main>
  );
}
