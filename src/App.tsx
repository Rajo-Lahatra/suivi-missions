// src/App.tsx
import './theme.css'
import { useEffect, useState } from 'react'
import { Auth } from '@/components/Auth'
import { CreateMissionForm } from '@/components/CreateMissionForm'
import { MissionsList } from '@/components/MissionsList'
import { supabase } from './lib/supabaseClient'

function App() {
  const [user, setUser] = useState<any>(null)
  const [refresh, setRefresh] = useState<number>(0)

  // Log du user à chaque connexion/déconnexion
  useEffect(() => {
    console.log('🔑 user changed:', user)
  }, [user])

  return (
    <div
      className="section"
      style={{ maxWidth: 640, margin: '40px auto', padding: 16, lineHeight: 1.5 }}
    >
      <img src="/og-image.png" alt="Logo Suivi Missions" />
      <h1>Suivi des missions</h1>

      <Auth onAuth={setUser} />

      {user ? (
        <>
          <p>Bienvenue, {user.email ?? user.id}</p>

          {/* Formulaire de création */}
          <CreateMissionForm onCreated={() => setRefresh((r) => r + 1)} />

          {/* Liste des missions — remonte fetching à chaque refresh */}
          <MissionsList key={refresh} />
        </>
      ) : (
        <p>Veuillez vous connecter pour continuer.</p>
      )}
    </div>
  )
}

export default App
