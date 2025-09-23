import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Collaborator, MissionStage, ServiceLine } from '../types'

const serviceOptions: ServiceLine[] = ['TLS','GCS','LT','Advisory']
const stageOptions = [
  { label: 'Opportunité',     value: 'opportunite'    },
  { label: 'Lettre envoyée',  value: 'lettre_envoyee' },
  { label: 'Lettre signée',   value: 'lettre_signee'  },
  { label: 'Staff traitement',value: 'staff_traitement' },
  { label: 'Revue manager',   value: 'revue_manager'  },
  { label: 'Revue associés',  value: 'revue_associes' },
  { label: 'Livrable envoyé', value: 'livrable_envoye'}
]

export function CreateMissionForm({ onCreated }: { onCreated: () => void }) {
  const [service, setService]         = useState<ServiceLine>('TLS')
  const [title, setTitle]             = useState('')
  const [clientName, setClientName]   = useState('')
  const [stage, setStage]             = useState<MissionStage>('opportunite')
  const [stateText, setStateText]     = useState('')
  const [actionsText, setActionsText] = useState('')
  const [honoraires, setHonoraires]   = useState<number>(0)
  const [dueDate, setDueDate]         = useState<string>('')
  const [partnerId, setPartnerId]     = useState<string | null>(null)
  const [assignees, setAssignees]     = useState<string[]>([])
  const [collabs, setCollabs]         = useState<Collaborator[]>([])
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('collaborators')
      .select('*')
      .order('last_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else      setCollabs(data as Collaborator[])
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { data: m, error: e1 } = await supabase
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
      .single()

    if (e1) { setError(e1.message); return }

    if (assignees.length && m) {
      const rows = assignees.map(id => ({
        mission_id: m.id,
        collaborator_id: id
      }))
      const { error: e2 } = await supabase
        .from('mission_collaborators')
        .insert(rows)
      if (e2) setError(e2.message)
    }

    onCreated()
  }

  if (!collabs.length && !error) return <p>Chargement…</p>
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      {/* service, title, clientName, stage, situation_state, situation_actions, honoraires, due_date */}

      <div>
        <label>Associé principal</label>
        <select
          value={partnerId || ''}
          onChange={e => setPartnerId(e.target.value || null)}
        >
          <option value="">— Choisir —</option>
          {collabs.filter(c => c.grade === 'Partner').map(c => (
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
  )
}
