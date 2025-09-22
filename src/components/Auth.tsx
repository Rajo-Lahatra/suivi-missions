import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'

type User = {
  id: string
  email?: string
} | null

export function Auth({ onAuth }: { onAuth: (user: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<User>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      onAuth(user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      onAuth(u)
    })
    return () => listener.subscription.unsubscribe()
  }, [onAuth])

  const signUp = async () => {
    setLoading(true)
    setMessage('Création du compte...')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage('Erreur: ' + error.message)
    else setMessage('Compte créé. Vérifiez votre email si la confirmation est activée.')
    setLoading(false)
  }

  const signIn = async () => {
    setLoading(true)
    setMessage('Connexion...')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage('Erreur: ' + error.message)
    else setMessage('Connecté.')
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setMessage('Déconnecté.')
    setLoading(false)
  }

  if (user) {
    return (
      <div style={{ marginBottom: 20 }}>
        <p>Connecté en tant que <strong>{user.email ?? user.id}</strong></p>
        <button onClick={signOut} disabled={loading}>Se déconnecter</button>
        {message && <p style={{ color: '#64748b' }}>{message}</p>}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Connexion / Inscription</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ marginBottom: 8, width: '100%', padding: 8 }}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ marginBottom: 8, width: '100%', padding: 8 }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={signIn} disabled={loading || !email || !password}>Se connecter</button>
        <button onClick={signUp} disabled={loading || !email || !password}>Créer un compte</button>
      </div>
      {message && <p style={{ color: '#64748b' }}>{message}</p>}
    </div>
  )
}
