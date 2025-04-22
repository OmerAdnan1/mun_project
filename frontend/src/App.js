import React, { useEffect, useState } from 'react';

function App() {
  const [backendMessage, setBackendMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:5000/api/test') // Make sure this matches your backend route
      .then(res => res.json())
      .then(data => setBackendMessage(data.message))
      .catch(err => {
        console.error('Error connecting to backend:', err);
        setBackendMessage('❌ Failed to connect to backend');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>🌐 Frontend-Backend Test</h1>
      <p><strong>Backend says:</strong> {backendMessage}</p>
    </div>
  );
}

export default App;
