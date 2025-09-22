// src/components/CollaboratorsList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Collaborator, CollaboratorGrade } from '../types';

export function CollaboratorsList() {
  const [collabs, setCollabs]     = useState<Collaborator[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [grade, setGrade]         = useState<CollaboratorGrade>('Junior');

  // 1. Charger la liste
  const fetchCollabs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('last_name', { ascending: true });
    if (error) setError(error.message);
    else       setCollabs(data as Collaborator[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCollabs();
  }, []);

  // 2. Créer un collaborateur (profil)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .insert({
        first_name: firstName,
        last_name: lastName,
        grade,
        id: '' // remplacer '' par l'UUID d’un auth.users déjà existant
      });
    if (error) setError(error.message);
    else {
      setFirstName('');
      setLastName('');
      setGrade('Junior');
      await fetchCollabs();
    }
    setLoading(false);
  };

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div>
      <h2>Collaborateurs</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input
          placeholder="Prénom"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          placeholder="Nom"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <select value={grade} onChange={e => setGrade(e.target.value as CollaboratorGrade)}>
          <option>Partner</option>
          <option>Senior Manager</option>
          <option>Manager</option>
          <option>Senior</option>
          <option>Junior</option>
          <option>Stagiaire</option>
        </select>
        <button type="submit">Créer</button>
      </form>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {collabs.map(c => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            {c.first_name} {c.last_name} — {c.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}
