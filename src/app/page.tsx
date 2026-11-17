import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import Work from "@/components/Work";
import Behind from "@/components/Behind";
import Lab from "@/components/Lab";
import Contact from "@/components/Contact";

// the one-page home: six chapters from the master doc
export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Studio />
      <Work />
      <Behind />
      <Lab />
      <Contact />
    </main>
  );
}
