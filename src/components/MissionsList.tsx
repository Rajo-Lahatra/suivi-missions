// src/components/MissionsList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Mission } from '../types';

export function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. On lance la requête au montage
    supabase
      .from<Mission>('missions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setMissions(data);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <ul>
      {missions.map((m) => (
        <li key={m.id}>
          <strong>{m.title}</strong> – {m.status}{' '}
          {m.due_date && <em>({new Date(m.due_date).toLocaleDateString()})</em>}
        </li>
      ))}
    </ul>
  );
}
