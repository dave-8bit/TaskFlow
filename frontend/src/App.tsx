import { useState, type FormEvent, type ChangeEvent } from 'react';
import './index.css';
import api from './services/api';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'MEMBER';
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'kanban'>('login');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setCurrentPage('kanban');
      alert('✅ Registration successful! Welcome to TaskFlow.');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.error || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { 
        email: formData.email, 
        password: formData.password 
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setCurrentPage('kanban');
      alert('✅ Login successful!');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.error || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCurrentPage('login');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navbar */}
      <nav className="bg-[#1a1a1a] shadow-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo + Brand */}
          <div className="flex items-center gap-4">
            <img 
              src="/logo.jpeg" 
              alt="TaskFlow Logo" 
              className="h-14 w-14 object-contain rounded-xl shadow-md"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tighter" style={{ color: '#007BFF' }}>
                TaskFlow
              </h1>
              <p className="text-xs text-gray-500 -mt-1 tracking-[3px] font-medium">PRODUCTIVITY SYSTEM</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 font-medium">
                Hello, {user.name || user.email} 
                <span className="text-[#20C997] ml-1">({user.role})</span>
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm px-5 py-2 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-400 transition-all font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-24 px-6">
        {currentPage === 'login' && (
          <div className="bg-[#1a1a1a] p-10 rounded-3xl shadow-2xl border border-gray-800">
            <h2 className="text-4xl font-semibold mb-10 text-center tracking-tight" style={{ color: '#007BFF' }}>
              Welcome Back
            </h2>
            {error && <p className="text-red-400 text-center mb-6">{error}</p>}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <input 
                type="email" 
                name="email"
                placeholder="Email address" 
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 bg-[#121212] border border-gray-700 rounded-2xl focus:outline-none focus:border-[#007BFF] text-white placeholder-gray-500 text-lg" 
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 bg-[#121212] border border-gray-700 rounded-2xl focus:outline-none focus:border-[#007BFF] text-white placeholder-gray-500 text-lg" 
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-lg font-semibold rounded-2xl transition-all mt-4"
                style={{ backgroundColor: '#007BFF', color: 'white' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-400">
              New here?{' '}
              <span 
                onClick={() => setCurrentPage('register')} 
                className="text-[#6610F2] font-medium cursor-pointer hover:underline"
              >
                Create an account
              </span>
            </p>
          </div>
        )}

        {currentPage === 'register' && (
          <div className="bg-[#1a1a1a] p-10 rounded-3xl shadow-2xl border border-gray-800">
            <h2 className="text-4xl font-semibold mb-10 text-center tracking-tight" style={{ color: '#007BFF' }}>
              Create Account
            </h2>
            {error && <p className="text-red-400 text-center mb-6">{error}</p>}
            
            <form onSubmit={handleRegister} className="space-y-6">
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-[#121212] border border-gray-700 rounded-2xl focus:outline-none focus:border-[#007BFF] text-white placeholder-gray-500 text-lg" 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email address" 
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 bg-[#121212] border border-gray-700 rounded-2xl focus:outline-none focus:border-[#007BFF] text-white placeholder-gray-500 text-lg" 
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 bg-[#121212] border border-gray-700 rounded-2xl focus:outline-none focus:border-[#007BFF] text-white placeholder-gray-500 text-lg" 
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-lg font-semibold rounded-2xl transition-all mt-4"
                style={{ backgroundColor: '#007BFF', color: 'white' }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-400">
              Already have an account?{' '}
              <span 
                onClick={() => setCurrentPage('login')} 
                className="text-[#6610F2] font-medium cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>
        )}

        {currentPage === 'kanban' && user && (
          <div className="text-center py-24">
            <div className="inline-flex items-center gap-4 mb-8">
              <img 
                src="/logo.jpeg" 
                alt="TaskFlow Logo" 
                className="h-16 w-16 object-contain"
              />
              <h2 className="text-5xl font-bold tracking-tighter" style={{ color: '#007BFF' }}>
                TaskFlow
              </h2>
            </div>
            <p className="text-2xl text-gray-400 mb-2">Welcome back,</p>
            <p className="text-3xl font-semibold" style={{ color: '#20C997' }}>
              {user.name || user.email}
            </p>
            <p className="text-sm text-gray-500 mt-1">({user.role} Account)</p>

            <div className="mt-16 bg-[#1a1a1a] p-16 rounded-3xl border border-gray-800">
              <p className="text-3xl mb-6" style={{ color: '#20C997' }}>🎉 Your Kanban Board is Ready</p>
              <p className="text-xl text-gray-400 max-w-md mx-auto">
                Next: Create boards, add columns, drag & drop tasks, and track analytics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;