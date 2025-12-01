import React from 'react';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider, useAuth } from './auth';

function Router() {
  const { me } = useAuth();
  const [ready, setReady] = React.useState(() => !!me);

  React.useEffect(() => {
    setReady(true);
  }, [me]);

  if (!ready) return null;

  if (!me) return <Login onLoggedIn={()=>setReady(true)} />;

  if (me.role === 'admin') return <AdminPanel />;
  if (me.role === 'client') return <ClientDashboard />;
  return <div className="p-6">Unknown role</div>;
}

export default function App() {
  return <AuthProvider><Router /></AuthProvider>;
}
