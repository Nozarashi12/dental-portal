// app/page.tsx
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
