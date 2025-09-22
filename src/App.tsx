import { useState } from 'react'
import { Auth } from '@/components/Auth'

function App() {
  const [user, setUser] = useState<any>(null)

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 16, lineHeight: 1.5 }}>
      <h1>Suivi des missions</h1>
      <Auth onAuth={setUser} />
      {user ? (
        <p>Bienvenue, {user.email ?? user.id}</p>
      ) : (
        <p>Veuillez vous connecter pour continuer.</p>
      )}
    </div>
  )
}

export default App