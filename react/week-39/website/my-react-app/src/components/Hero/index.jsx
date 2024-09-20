import NavbarMobile from "../NavbarMobile";
import NavbarDesktop from "../NavbarDesktop";
import HeroSection from "../HeroSection";

function Hero() {
  return (
    <div className="hero-wrapper">
      <header>
        <NavbarMobile />
        <NavbarDesktop />
      </header>
      <HeroSection />
    </div>
  )
}

export default Hero;