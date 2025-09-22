// src/App.tsx
import './theme.css'                            // ton thème global
import { useState } from 'react'
import { Auth } from '@/components/Auth'        // ton composant d’auth
import { CreateMission } from '@/components/CreateMission'
import { MissionsList } from '@/components/MissionsList'

function App() {
  const [user, setUser] = useState<any>(null)

  return (
    <div className="section" style={{ maxWidth: 640, margin: '40px auto', padding: 16, lineHeight: 1.5 }}>
      <img src="/og-image.png" alt="Logo Suivi Missions" />

      <h1>Suivi des missions</h1>

      {/* Composant d’authentification */}
      <Auth onAuth={setUser} />

      {user ? (
        <>
          {/* Message de bienvenue */}
          <p>Bienvenue, {user.email ?? user.id}</p>

          {/* Formulaire de création */}
          <CreateMission />

          {/* Liste des missions */}
          <MissionsList />
        </>
      ) : (
        <p>Veuillez vous connecter pour continuer.</p>
      )}
    </div>
  )
}

export default App
