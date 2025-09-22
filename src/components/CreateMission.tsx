// src/components/CreateMission.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function CreateMission() {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // pour supabase-js v2, user() n'existe plus, on utilise getSession()
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('Utilisateur non authentifié');

      console.log('📝 Création de la mission pour', user.id);
      const { error: insertError, data } = await supabase
        .from('missions')
        .insert({ title, user_id: user.id });

      if (insertError) throw insertError;
      console.log('✅ Mission créée', data);

      setTitle('');
      // TODO : refetch de la liste via un prop ou Context
    } catch (err: any) {
      console.error('❌ Erreur CreateMission:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
      console.log('🔄 submit terminé');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nouvelle mission"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || title.trim() === ''}>
        {submitting ? 'Enregistrement…' : 'Créer la mission'}
      </button>
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
    </form>
  );
}
