// app/page.tsx
import Navbar from "./Client/Navbar";
import LandingPage from "./Client/LandingPage";
import Footer from "./Client/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
