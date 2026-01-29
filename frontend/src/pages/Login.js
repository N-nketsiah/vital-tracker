import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Button, Input, Alert, LoadingSpinner } from '../components/UI';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-2 text-gray-800'>VitalTrack</h1>
        <p className='text-center text-gray-600 mb-6'>Your Personal Health Companion</p>

        {(error || localError) && (
          <Alert
            type='error'
            message={error || localError}
            onClose={() => {
              setError(null);
              setLocalError('');
            }}
          />
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@example.com'
            required
          />

          <Input
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='••••••••'
            required
          />

          <Button
            type='submit'
            disabled={isLoading}
            className='w-full'
            variant='primary'
          >
            {isLoading ? <LoadingSpinner /> : 'Sign In'}
          </Button>
        </form>

        <p className='text-center text-gray-600 mt-6'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 font-semibold hover:underline'>
            Sign up here
          </Link>
        </p>

        <hr className='my-6' />

        <p className='text-center text-sm text-gray-500'>
          Demo credentials: demo@example.com / password123
        </p>
      </Card>
    </div>
  );
};

export default Login;
