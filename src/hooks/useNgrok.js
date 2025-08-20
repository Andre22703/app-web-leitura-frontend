import { useState, useEffect } from 'react';

export function useNgrokUrl() {
  const [ngrokUrl, setNgrokUrl] = useState(null);

  useEffect(() => {
    async function fetchNgrok() {
      try {
        const res = await fetch('https://api.jsonbin.io/v3/b/68a2e0a5d0ea881f405c44d8', {
          headers: {
            'X-Master-Key': '$2a$10$gT767Lq/V5VcVdbaS8StQObMLvicZ5SezhiMC6lwSt0iHPqCUzGNu', // substitui com a tua master key
            'Content-Type': 'application/json',
          },
        });
        const json = await res.json();
        setNgrokUrl(json.record.ngrok); // pega o campo ngrok
      } catch (err) {
        console.error('Erro ao buscar ngrok:', err);
      }
    }

    fetchNgrok();

    // Atualiza a cada 30s
    const interval = setInterval(fetchNgrok, 30000);
    return () => clearInterval(interval);
  }, []);

  return ngrokUrl;
}
