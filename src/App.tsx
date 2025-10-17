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
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Process />
      <Performance />
      <Gallery />
      <Contact />
    </div>
  );
}

export default App;