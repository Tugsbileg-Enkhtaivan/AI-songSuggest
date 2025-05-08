import PromptForm from "./_components/PromptForm";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-xl font-bold">Ask GPT-4o-mini</h1>
      <PromptForm />
    </main>
  );
}
