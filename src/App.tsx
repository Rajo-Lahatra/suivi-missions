import './theme.css'
import { useEffect, useState } from 'react'
import { Auth } from '@/components/Auth'
import { CreateMission } from '@/components/CreateMission'
import { MissionsList } from '@/components/MissionsList'
import { supabase } from './lib/supabaseClient'  // si tu veux écouter les events aussi

function App() {
  const [user, setUser] = useState<any>(null)

  // log du user à chaque changement
  useEffect(() => {
    console.log('🔑 user changed:', user)
  }, [user])

  return (
    <div className="section" style={{ maxWidth: 640, margin: '40px auto', padding: 16, lineHeight: 1.5 }}>
      <img src="/og-image.png" alt="Logo Suivi Missions" />
      <h1>Suivi des missions</h1>

      <Auth onAuth={setUser} />

      {user ? (
        <>
          <p>Bienvenue, {user.email ?? user.id}</p>
          <CreateMission />
          <MissionsList />
        </>
      ) : (
        <p>Veuillez vous connecter pour continuer.</p>
      )}
    </div>
  )
}

export default App
