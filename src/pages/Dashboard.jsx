import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    supabase.from('builders').select('slug').eq('id', user.id).single().then(({ data }) => {
      if (!data) navigate('/setup', { replace: true })
      else navigate(`/builder/${data.slug}`, { replace: true })
    })
  }, [user, navigate])

  return null
}
