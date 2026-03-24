import { useState } from 'react'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { useAuth } from '@hooks/useAuth'

export function RegisterForm() {
  const { register, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    try {
      await register(email, password, name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" />
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      <Button type="submit" loading={isLoading} className="w-full">Create Account</Button>
    </form>
  )
}
