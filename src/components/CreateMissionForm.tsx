// src/components/CreateMissionForm.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Collaborator, MissionStage, ServiceLine } from '../types';

const serviceOptions: ServiceLine[] = ['TLS', 'GCS', 'LT', 'Advisory'];
const stageOptions: { label: string; value: MissionStage }[] = [
  { label: 'Opportunité', value: 'opportunite' },
  { label: 'Lettre envoyée', value: 'lettre_envoyee' },
  { label: 'Lettre signée', value: 'lettre_signee' },
  { label: 'Staff traitement', value: 'staff_traitement' },
  { label: 'Revue manager', value: 'revue_manager' },
  { label: 'Revue associés', value: 'revue_associes' },
  { label: 'Livrable envoyé', value: 'livrable_envoye' }
];

export function CreateMissionForm({ onCreated }: { onCreated: () => void }) {
  const [service, setService] = useState<ServiceLine>('TLS');
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [stage, setStage] = useState<MissionStage>('opportunite');
  const [stateText, setStateText] = useState('');
  const [actionsText, setActionsText] = useState('');
  const [honoraires, setHonoraires] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>('');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [errors, setErrors] = useState<string | null>(null);

  const [collabs, setCollabs] = useState<Collaborator[]>([]);
  const [loadingCollabs, setLoadingCollabs] = useState(true);

  useEffect(() => {
    supabase
      .from('collaborators')
      .select('*')
      .order('last_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) setErrors(error.message);
        else setCollabs(data as Collaborator[]);
        setLoadingCollabs(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // 1) Insertion de la mission
    const { data: newM, error: err1 } = await supabase
      .from('missions')
      .insert({
        service,
        title,
        client_name: clientName,
        description: null,
        stage,
        situation_state: stateText,
        situation_actions: actionsText,
        honoraires,
        status: 'pending',
        due_date: dueDate || null,
        partner_id: partnerId
      })
      .single();

    if (err1) {
      setErrors(err1.message);
      return;
    }

    // 2) Liaison aux collaborateurs choisis
    if (assignees.length && newM) {
      const rows = assignees.map((cid) => ({
        mission_id: newM.id,
        collaborator_id: cid
      }));
      const { error: err2 } = await supabase
        .from('mission_collaborators')
        .insert(rows);
      if (err2) setErrors(err2.message);
    }

    onCreated();
  };

  if (loadingCollabs) return <p>Chargement des collaborateurs…</p>;
  if (errors) return <p style={{ color: 'red' }}>Erreur : {errors}</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <div>
        <label>Ligne de service</label>
        <select value={service} onChange={e => setService(e.target.value as ServiceLine)}>
          {serviceOptions.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label>Titre de la mission</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required/>
      </div>

      <div>
        <label>Nom du client</label>
        <input value={clientName} onChange={e => setClientName(e.target.value)} required/>
      </div>

      <div>
        <label>Étape actuelle</label>
        <select value={stage} onChange={e => setStage(e.target.value as MissionStage)}>
          {stageOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Situation – État</label>
        <textarea value={stateText} onChange={e => setStateText(e.target.value)} />
      </div>

      <div>
        <label>Situation – Actions à prendre</label>
        <textarea value={actionsText} onChange={e => setActionsText(e.target.value)} />
      </div>

      <div>
        <label>Honoraires</label>
        <input
          type="number"
          step="0.01"
          value={honoraires}
          onChange={e => setHonoraires(parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Échéance</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <label>Associé principal (Partner)</label>
        <select onChange={e => setPartnerId(e.target.value || null)} value={partnerId || ''}>
          <option value="">— Choisir —</option>
          {collabs
            .filter(c => c.grade === 'Partner')
            .map(c => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label>Collaborateurs assignés</label>
        <select
          multiple
          value={assignees}
          onChange={e =>
            setAssignees(Array.from(e.target.selectedOptions, o => o.value))
          }
        >
          {collabs.map(c => (
            <option key={c.id} value={c.id}>
              {c.first_name} {c.last_name} ({c.grade})
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Créer la mission</button>
    </form>
  );
}
