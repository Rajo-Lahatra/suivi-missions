// src/components/MissionsList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Mission, MissionStage } from '../types';

// Libellés pour chaque étape métier
const stageOptions: { label: string; value: MissionStage }[] = [
  { label: 'Opportunité',        value: 'opportunite'     },
  { label: 'Lettre envoyée',     value: 'lettre_envoyee'  },
  { label: 'Lettre signée',      value: 'lettre_signee'   },
  { label: 'Staff traitement',   value: 'staff_traitement'},
  { label: 'Revue manager',      value: 'revue_manager'   },
  { label: 'Revue associés',     value: 'revue_associes'  },
  { label: 'Livrable envoyé',    value: 'livrable_envoye' }
];

export function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);
  const [error, setError]         = useState<string | null>(null);

  // 1. Récupère les missions
  const fetchMissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else     setMissions(data as Mission[]);

    setLoading(false);
  };

  // appel initial
  useEffect(() => {
    fetchMissions();
  }, []);

  // 2. Dupliquer via RPC
  const handleDuplicate = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .rpc('duplicate_mission', { p_id: id });

    if (error) setError(error.message);
    else       await fetchMissions();
  };

  // 3. Supprimer
  const handleDelete = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', id);

    if (error) setError(error.message);
    else       await fetchMissions();
  };

  // 4. Mettre à jour le stage
  const handleStageChange = async (id: string, stage: MissionStage) => {
    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .update({ stage })
      .eq('id', id);

    if (error) setError(error.message);
    else       await fetchMissions();
  };

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {missions.map((m) => (
        <li key={m.id} style={{ marginBottom: 16, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
          <h3>{m.title}</h3>
          <p>{m.situation}</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>
              Étape :
              <select
                value={m.stage}
                onChange={(e) => handleStageChange(m.id, e.target.value as MissionStage)}
                disabled={loading}
                style={{ marginLeft: 4 }}
              >
                {stageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <button onClick={() => handleDuplicate(m.id)} disabled={loading}>
              Dupliquer
            </button>
            <button onClick={() => handleDelete(m.id)} disabled={loading}>
              Supprimer
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
