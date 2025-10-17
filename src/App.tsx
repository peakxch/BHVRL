import React from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Performance } from './components/Performance';
import { Process } from './components/Process';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';

function App() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
    <Navigation />
      <section className="snap-start">
        <Hero />
      </section>
      <section className="snap-start">
        <Process />
      </section>
      <section className="snap-start">
        <Performance />
      </section>
      <section className="snap-start">
        <Gallery />
      </section>
      <section className="snap-start">
        <Contact />
      </section>
    </div>
    
  );
}

export default App;