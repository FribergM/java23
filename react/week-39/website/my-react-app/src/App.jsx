import Hero from './components/Hero'
import Article from './components/Article'
import Footer from './components/Footer'
import './App.css'
import HeroImg from './components/HeroImg'
import Service from './components/Service'
import Invoice from './components/Invoice'

function App() {
  return (
    <>
      <Hero />
      <main>
        <HeroImg />

        <Article />
        <Service />
        
        <Invoice />
      </main>

      <Footer />
    </>
  )
}

export default App
