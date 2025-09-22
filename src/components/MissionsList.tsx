// src/components/MissionsList.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Mission, MissionStage } from '../types'
import { InvoicesList } from './InvoicesList'

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
  const [missions, setMissions]           = useState<Mission[]>([])
  const [loading, setLoading]            = useState(true)
  const [error, setError]                = useState<string | null>(null)
  const [expandedMissionId, setExpanded] = useState<string | null>(null)

  // 1. On spécifie chaque embed avec le nom de la contrainte
  const fetchMissions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('missions')
      .select(`
        *,
        partner:collaborators!missions_partner_fkey(
          first_name,
          last_name,
          grade,
          email
        ),
        mission_collaborators!inner(
          collaborator:collaborators(
            first_name,
            last_name,
            grade,
            email
          )
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

  const handleDuplicate = async (id: string) => {
    setLoading(true)
    const { error } = await supabase.rpc('duplicate_mission', { p_id: id })
    if (error) setError(error.message)
    await fetchMissions()
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    const { error } = await supabase.from('missions').delete().eq('id', id)
    if (error) setError(error.message)
    await fetchMissions()
  }

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
        const isOpen = expandedMissionId === m.id

        return (
          <li key={m.id} style={{ marginBottom: 24, borderBottom: '1px solid #ddd', paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px' }}>
                  {m.title}{' '}
                  {m.partner && (
                    <small style={{ color: '#666' }}>
                      — {m.partner.first_name} {m.partner.last_name} ({m.partner.grade})
                    </small>
                  )}
                </h3>
                <p>Client : {m.client_name}</p>
                <p>
                  Sit. : {m.situation_state}
                  <br/>
                  Actions : {m.situation_actions}
                </p>
                <small>Sit. : {m.situation} – Honoraires : {m.honoraires.toFixed(2)} €</small>
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

                {m.mission_collaborators.length > 0 && (
                  <div>
                    <p><strong>Collaborateurs assignés :</strong></p>
                    <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'disc' }}>
                      {m.mission_collaborators.map((mc) => (
                        <li key={mc.collaborator.email}>
                          {mc.collaborator.first_name} {mc.collaborator.last_name} ({mc.collaborator.grade})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <InvoicesList missionId={m.id} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
