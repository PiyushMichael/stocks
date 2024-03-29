'use client'
import Graph from "@/components/Graph";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <QueryClientProvider client={queryClient}>
      <Graph />
      </QueryClientProvider>
    </main>
  );
}
