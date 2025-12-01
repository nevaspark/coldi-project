import React, { useState } from 'react';
import { useAuth } from '../auth';

export default function Login({ onLoggedIn }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const doLogin = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      onLoggedIn();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={doLogin} className="card w-full max-w-md">
        <div className="text-2xl font-semibold">Welcome to Coldi</div>
        <p className="text-gray-400 text-sm mt-1">Sign in to continue.</p>

        <div className="mt-4">
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="mt-3">
          <label className="label">Password</label>
          <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {err && <div className="mt-3 text-rose-400 text-sm">{err}</div>}

        <button className="btn w-full mt-5">Sign in</button>

        <div className="mt-4 text-xs text-gray-500">
          Demo credentials:
          <div>Admin: admin@coldi.ai / Admin123!</div>
          <div>Client A: a@client.local / ClientA123!</div>
          <div>Client B: b@client.local / ClientB123!</div>
        </div>
      </form>
    </div>
  );
}
