import { Navbar } from "./components/Navbar";
import { Banner } from "./components/Banner";
import { Section } from "./components/Section";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Banner />

      <Section>
        <Section.Title>Who are we?</Section.Title>
        <Section.Description>
          Welcome to Indonesian WebTech! Our mission is to keep you updated on
          the latest technological developments from around the globe. We
          believe in the power of technology to connect and inspire.
        </Section.Description>
      </Section>

      <Footer />
    </>
  );
}
