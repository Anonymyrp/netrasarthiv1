import React, { useState } from 'react';
import EyesLoader from './components/EyesLoader/EyesLoader';

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <EyesLoader onComplete={() => setLoading(false)} />}
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.6s ease', padding: '2rem' }}>
        <h1>NetraSarthi Opening</h1>
        <p>Loader complete. Site content revealed.</p>
      </main>
    </>
  );
}
