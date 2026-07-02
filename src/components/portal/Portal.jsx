import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Login from './Login';
import Dashboard from './Dashboard';

export default function Portal() {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
