import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/neocube-logo.png'

export default function Auth({register=false}) {
  const navigate = useNavigate()
  const [error,setError] = useState('')
  const submit = e => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (register && data.get('password') !== data.get('confirmPassword')) { setError('Passwords do not match.'); return }
    localStorage.setItem('neoLoggedIn','true')
    localStorage.setItem('neoUser', JSON.stringify({name:data.get('name') || 'NeoCube Customer', email:data.get('email')}))
    navigate('/dashboard')
  }
  return <div className="grid min-h-[calc(100vh-76px)] place-items-center bg-gradient-to-br from-cream to-wine-50 px-4 py-12">
    <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-soft md:p-9">
      <img src={logo} alt="NeoCube Realty" className="mx-auto h-14 w-auto"/>
      <h1 className="mt-5 text-center font-display text-3xl font-bold">{register?'Create your account':'Welcome back'}</h1>
      <p className="mt-2 text-center text-sm text-gray-500">{register?'Join NeoCube Realty and manage your property journey.':'Login to manage your inquiries, visits and favorites.'}</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        {register && <div><label className="field-label">Full Name</label><input name="name" required className="field-control"/></div>}
        <div><label className="field-label">Email</label><input name="email" type="email" required className="field-control"/></div>
        {register && <div><label className="field-label">Phone</label><input name="phone" required className="field-control"/></div>}
        <div><label className="field-label">Password</label><input name="password" type="password" required className="field-control"/></div>
        {register && <div><label className="field-label">Confirm Password</label><input name="confirmPassword" type="password" required className="field-control"/></div>}
        {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        <button className="btn-primary w-full">{register?'Register':'Login'}</button>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500">{register?'Already have an account?':'Don’t have an account?'} <Link className="font-bold text-wine-700" to={register?'/login':'/register'}>{register?'Login':'Register'}</Link></p>
    </div>
  </div>
}
