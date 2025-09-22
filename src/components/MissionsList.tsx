// src/components/MissionsList.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Mission, MissionStage } from '../types'
import { InvoicesList } from './InvoicesList'

// Labels pour les étapes
const stageOptions: { label: string; value: MissionStage }[] = [
  { label: 'Opportunité',      value: 'opportunite'     },
  { label: 'Lettre envoyée',   value: 'lettre_envoyee'  },
  { label: 'Lettre signée',    value: 'lettre_signee'   },
  { label: 'Staff traitement', value: 'staff_traitement'},
  { label: 'Revue manager',    value: 'revue_manager'   },
  { label: 'Revue associés',   value: 'revue_associes'  },
  { label: 'Livrable envoyé',  value: 'livrable_envoye' }
]

export function MissionsList() {
  const [missions, setMissions]     = useState<Mission[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [expandedId, setExpanded]   = useState<string | null>(null)

  // 1) Charger missions + collaborator
  const fetchMissions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('missions')
      .select(`
        *,
        collaborator:collaborators(
          first_name,
          last_name,
          grade,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else       setMissions(data as Mission[])
    setLoading(false)
  }

  useEffect(() => {
    fetchMissions()
  }, [])

  // dupliquer
  const handleDuplicate = async (id: string) => {
    setLoading(true)
    const { error } = await supabase.rpc('duplicate_mission', { p_id: id })
    if (error) setError(error.message)
    await fetchMissions()
  }

  // supprimer
  const handleDelete = async (id: string) => {
    setLoading(true)
    const { error } = await supabase.from('missions').delete().eq('id', id)
    if (error) setError(error.message)
    await fetchMissions()
  }

  // changer étape
  const handleStageChange = async (id: string, stage: MissionStage) => {
    setLoading(true)
    const { error } = await supabase
      .from('missions')
      .update({ stage })
      .eq('id', id)
    if (error) setError(error.message)
    await fetchMissions()
  }

  if (loading) return <p>Chargement…</p>
  if (error)   return <p style={{ color: 'red' }}>Erreur : {error}</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {missions.map((m) => {
        const isOpen = expandedId === m.id

        return (
          <li key={m.id} style={{ marginBottom: 24, borderBottom: '1px solid #ddd', paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px' }}>
                  {m.title}{' '}
                  {m.collaborator && (
                    <small style={{ color: '#666' }}>
                      — {m.collaborator.first_name} {m.collaborator.last_name} (
                      {m.collaborator.grade})
                    </small>
                  )}
                </h3>
                <small>
                  Sit. : {m.situation} – Honoraires : {m.honoraires.toFixed(2)} €
                </small>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={m.stage}
                  onChange={(e) => handleStageChange(m.id, e.target.value as MissionStage)}
                >
                  {stageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleDuplicate(m.id)}>Dupliquer</button>
                <button onClick={() => handleDelete(m.id)}>Supprimer</button>
                <button onClick={() => setExpanded(isOpen ? null : m.id)}>
                  {isOpen ? 'Cacher détails' : 'Voir détails'}
                </button>
              </div>
            </div>

            {isOpen && (
              <div style={{ marginTop: 12, paddingLeft: 16 }}>
                <p><strong>Description :</strong> {m.description || '—'}</p>
                <p><strong>Échéance :</strong> {m.due_date ? new Date(m.due_date).toLocaleDateString() : '—'}</p>
                <InvoicesList missionId={m.id} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
