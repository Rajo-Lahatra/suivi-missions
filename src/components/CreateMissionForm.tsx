// src/components/CreateMissionForm.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { MissionStage, ServiceLine } from '../types'

const serviceOptions: ServiceLine[] = ['TLS', 'GCS', 'LT', 'Advisory']
const stageOptions: { label: string; value: MissionStage }[] = [
  { label: 'Opportunité',      value: 'opportunite'    },
  { label: 'Lettre envoyée',   value: 'lettre_envoyee' },
  { label: 'Lettre signée',    value: 'lettre_signee'  },
  { label: 'Staff traitement', value: 'staff_traitement' },
  { label: 'Revue manager',    value: 'revue_manager'  },
  { label: 'Revue associés',   value: 'revue_associes' },
  { label: 'Livrable envoyé',  value: 'livrable_envoye' }
]

export function CreateMissionForm({ onCreated }: { onCreated: () => void }) {
  const [service, setService]       = useState<ServiceLine>('TLS')
  const [title, setTitle]           = useState('')
  const [clientName, setClientName] = useState('')
  const [stage, setStage]           = useState<MissionStage>('opportunite')
  const [stateText, setStateText]   = useState('')
  const [actionsText, setActionsText] = useState('')
  const [honoraires, setHonoraires] = useState<number>(0)
  const [dueDate, setDueDate]       = useState<string>('')
  const [error, setError]           = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { data: newMission, error: insertError } = await supabase
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
        due_date: dueDate || null
      })
      .single()

    if (insertError) {
      setError(insertError.message)
      return
    }

    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}

      <div>
        <label>Ligne de service</label>
        <select
          value={service}
          onChange={e => setService(e.target.value as ServiceLine)}
        >
          {serviceOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Titre de la mission</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Nom du client</label>
        <input
          type="text"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Étape actuelle</label>
        <select
          value={stage}
          onChange={e => setStage(e.target.value as MissionStage)}
        >
          {stageOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Situation – État</label>
        <textarea
          value={stateText}
          onChange={e => setStateText(e.target.value)}
        />
      </div>

      <div>
        <label>Situation – Actions à prendre</label>
        <textarea
          value={actionsText}
          onChange={e => setActionsText(e.target.value)}
        />
      </div>

      <div>
        <label>Honoraires (€)</label>
        <input
          type="number"
          step="0.01"
          value={honoraires}
          onChange={e => setHonoraires(parseFloat(e.target.value) || 0)}
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

      <button type="submit">Créer la mission</button>
    </form>
  )
}
