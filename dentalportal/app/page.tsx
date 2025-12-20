// app/page.tsx
import Navbar from "./client/Navbar";
import LandingPage from "./client/LandingPage";
import Footer from "./client/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
