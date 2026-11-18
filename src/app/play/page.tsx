import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PlayField from "@/components/PlayField";

export const metadata: Metadata = {
  title: "Play — Sydney Tran",
  description: "My playground: lighting tests, posters, 3D and interface experiments.",
};

// the playground: a full-screen, endless wall of pieces you drag around
export default function Play() {
  return (
    <main className="h-svh overflow-hidden">
      <Nav />
      <PlayField />
    </main>
  );
}
