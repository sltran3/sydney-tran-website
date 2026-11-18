import Nav from "@/components/Nav";
import ChromeMorph from "@/components/ChromeMorph";
import Hero from "@/components/Hero";
import Altitude from "@/components/Altitude";
import Studio from "@/components/Studio";
import Work from "@/components/Work";
import Tech from "@/components/Tech";
import Contact from "@/components/Contact";

// the one-page home: the main chapters (Play lives at /play)
export default function Home() {
  return (
    <main>
      <Nav />
      <ChromeMorph />
      <Hero />
      <Altitude />
      <Studio />
      <Work />
      <Tech />
      <Contact />
    </main>
  );
}
