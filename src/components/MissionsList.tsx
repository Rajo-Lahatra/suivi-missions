import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Mission, MissionStage } from '../types'

const stages = [
  { label: 'Opportunité',     value: 'opportunite'    },
  { label: 'Lettre envoyée',  value: 'lettre_envoyee' },
  { label: 'Lettre signée',   value: 'lettre_signee'  },
  { label: 'Staff traitement',value: 'staff_traitement' },
  { label: 'Revue manager',   value: 'revue_manager'  },
  { label: 'Revue associés',  value: 'revue_associes' },
  { label: 'Livrable envoyé', value: 'livrable_envoye'}
]

export function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else       setMissions(data as Mission[])

    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  if (loading) return <p>Chargement…</p>
  if (error)   return <p style={{ color: 'red' }}>Erreur : {error}</p>

  return (
    <ul style={{ padding: 0, listStyle: 'none' }}>
      {missions.map(m => (
        <li key={m.id} style={{ marginBottom: 24 }}>
          <h3>{m.title}</h3>
          <p>Client : {m.client_name}</p>
          <small>Honoraires : {m.honoraires.toFixed(2)} €</small>
          {/* Duplicate, Delete, Stage change… */}
        </li>
      ))}
    </ul>
  )
}
