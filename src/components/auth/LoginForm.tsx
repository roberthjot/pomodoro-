import { useState } from 'react'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { useAuth } from '@hooks/useAuth'

export function LoginForm() {
  const { signInWithEmail, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmail(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      <Button type="submit" loading={isLoading} className="w-full">Sign In</Button>
    </form>
  )
}
