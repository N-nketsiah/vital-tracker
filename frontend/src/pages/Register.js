import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Button, Input, Select, Alert, LoadingSpinner } from '../components/UI';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, setError } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    gender: ''
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name || !formData.email || !formData.password) {
      setLocalError('Name, email, and password are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.age || null,
        formData.height || null,
        formData.weight || null,
        formData.gender || null
      );
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h1 className='text-3xl font-bold text-center mb-2 text-gray-800'>VitalTrack</h1>
        <p className='text-center text-gray-600 mb-6'>Create Your Account</p>

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
            label='Full Name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='John Doe'
            required
          />

          <Input
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='you@example.com'
            required
          />

          <Input
            label='Password'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••'
            required
          />

          <Input
            label='Confirm Password'
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='••••••••'
            required
          />

          <Input
            label='Age'
            type='number'
            name='age'
            value={formData.age}
            onChange={handleChange}
            placeholder='25'
          />

          <Input
            label='Height (cm)'
            type='number'
            name='height'
            value={formData.height}
            onChange={handleChange}
            placeholder='180'
          />

          <Input
            label='Weight (kg)'
            type='number'
            name='weight'
            value={formData.weight}
            onChange={handleChange}
            placeholder='75'
          />

          <Select
            label='Gender'
            name='gender'
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
          />

          <Button
            type='submit'
            disabled={isLoading}
            className='w-full'
            variant='primary'
          >
            {isLoading ? <LoadingSpinner /> : 'Create Account'}
          </Button>
        </form>

        <p className='text-center text-gray-600 mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 font-semibold hover:underline'>
            Sign in here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
