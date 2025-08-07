import { useState, useEffect } from 'react';

export default function useSubfamilias() {
  const [subfamilias, setSubfamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubfamilias() {
      try {
        const response = await fetch('http://localhost:3001/subfamilias');
        if (!response.ok) throw new Error('Erro ao buscar subfamílias');
        const data = await response.json();
        setSubfamilias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubfamilias();
  }, []);

  return { subfamilias, loading, error };
}
