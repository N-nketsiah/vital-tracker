import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Button, Input, Select, Alert } from '../components/UI';

const HealthGoals = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goalType: '',
    targetValue: '',
    unit: '',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch goals');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5001/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setSuccess('Goal created successfully!');
      setFormData({ goalType: '', targetValue: '', unit: '', deadline: '' });
      setShowForm(false);
      fetchGoals();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/goals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGoals();
    } catch (err) {
      setError('Failed to delete goal');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <nav className='bg-white shadow p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Health Goals</h1>
        <button onClick={() => navigate('/dashboard')} className='text-blue-600 hover:text-blue-800'>Back</button>
      </nav>

      <div className='max-w-4xl mx-auto p-6'>
        {error && <Alert type='error' message={error} onClose={() => setError('')} />}
        {success && <Alert type='success' message={success} onClose={() => setSuccess('')} />}

        <div className='mb-6'>
          <Button onClick={() => setShowForm(!showForm)} variant='primary'>
            {showForm ? 'Cancel' : 'Set New Goal'}
          </Button>
        </div>

        {showForm && (
          <Card className='mb-6'>
            <h2 className='text-xl font-bold mb-4'>Set a New Health Goal</h2>
            <form onSubmit={handleSubmit}>
              <Select
                label='Goal Type'
                name='goalType'
                value={formData.goalType}
                onChange={handleChange}
                options={[
                  { value: 'weight', label: 'Weight Loss' },
                  { value: 'steps', label: 'Daily Steps' },
                  { value: 'water', label: 'Water Intake' },
                  { value: 'sleep', label: 'Sleep Hours' }
                ]}
                required
              />
              <Input
                label='Target Value'
                type='number'
                name='targetValue'
                value={formData.targetValue}
                onChange={handleChange}
                placeholder='e.g., 70 for weight in kg'
                required
              />
              <Input
                label='Unit'
                type='text'
                name='unit'
                value={formData.unit}
                onChange={handleChange}
                placeholder='e.g., kg, steps, liters, hours'
              />
              <Input
                label='Deadline'
                type='date'
                name='deadline'
                value={formData.deadline}
                onChange={handleChange}
              />
              <Button type='submit' variant='primary' disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Goal'}
              </Button>
            </form>
          </Card>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {goals.map((goal) => (
            <Card key={goal._id}>
              <div className='flex justify-between items-start mb-3'>
                <h3 className='text-lg font-bold text-gray-800 capitalize'>
                  {goal.goalType.replace('-', ' ')}
                </h3>
                <button
                  onClick={() => deleteGoal(goal._id)}
                  className='text-red-500 hover:text-red-700 text-sm'
                >
                  Delete
                </button>
              </div>
              <p className='text-gray-600 mb-2'>Target: <strong>{goal.targetValue} {goal.unit}</strong></p>
              <p className='text-gray-500 text-sm'>
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
              <div className='mt-3 w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full'
                  style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                />
              </div>
            </Card>
          ))}
        </div>

        {goals.length === 0 && !showForm && (
          <Card>
            <p className='text-center text-gray-500'>No goals yet. Create one to get started!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthGoals;
