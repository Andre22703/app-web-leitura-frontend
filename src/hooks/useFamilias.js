import { useState, useEffect } from 'react';
import { fetchFamilias } from '../services/api';

export default function useFamilias() {
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilias()
      .then(setFamilias)
      .catch(err => console.error('Erro ao carregar famílias:', err))
      .finally(() => setLoading(false));
  }, []);

  return { familias, loading };
}
