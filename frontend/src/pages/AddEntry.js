import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useHealthStore from '../store/healthStore';
import { Card, Button, Input, Alert, LoadingSpinner } from '../components/UI';

const AddEntry = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { addEntry, isLoading, error, setError } = useHealthStore();
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heartRate: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    weight: '',
    sleep: '',
    steps: '',
    water: '',
    mood: ''
  });

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
    setSuccess('');

    const entry = {
      date: new Date(formData.date),
      ...(formData.heartRate && { heartRate: parseFloat(formData.heartRate) }),
      ...(formData.bloodPressureSys && { bloodPressureSys: parseFloat(formData.bloodPressureSys) }),
      ...(formData.bloodPressureDia && { bloodPressureDia: parseFloat(formData.bloodPressureDia) }),
      ...(formData.weight && { weight: parseFloat(formData.weight) }),
      ...(formData.sleep && { sleep: parseFloat(formData.sleep) }),
      ...(formData.steps && { steps: parseFloat(formData.steps) }),
      ...(formData.water && { water: parseFloat(formData.water) }),
      ...(formData.mood && { mood: parseFloat(formData.mood) })
    };

    try {
      await addEntry(token, entry);
      setSuccess('Health entry added successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-8 px-4'>
      <Card className='max-w-2xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Add Health Entry</h1>
          <p className='text-gray-600'>Log your vital signs and health metrics</p>
        </div>

        {error && <Alert type='error' message={error} />}
        {localError && <Alert type='error' message={localError} onClose={() => setLocalError('')} />}
        {success && <Alert type='success' message={success} />}

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Date'
              type='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              required
            />

            <Input
              label='Heart Rate (bpm)'
              type='number'
              name='heartRate'
              value={formData.heartRate}
              onChange={handleChange}
              placeholder='60-100'
              min='40'
              max='200'
            />

            <Input
              label='Blood Pressure Systolic'
              type='number'
              name='bloodPressureSys'
              value={formData.bloodPressureSys}
              onChange={handleChange}
              placeholder='120'
              min='70'
              max='200'
            />

            <Input
              label='Blood Pressure Diastolic'
              type='number'
              name='bloodPressureDia'
              value={formData.bloodPressureDia}
              onChange={handleChange}
              placeholder='80'
              min='40'
              max='130'
            />

            <Input
              label='Weight (kg)'
              type='number'
              name='weight'
              value={formData.weight}
              onChange={handleChange}
              placeholder='75'
              step='0.1'
              min='20'
              max='300'
            />

            <Input
              label='Sleep (hours)'
              type='number'
              name='sleep'
              value={formData.sleep}
              onChange={handleChange}
              placeholder='8'
              step='0.5'
              min='0'
              max='24'
            />

            <Input
              label='Steps'
              type='number'
              name='steps'
              value={formData.steps}
              onChange={handleChange}
              placeholder='10000'
              min='0'
            />

            <Input
              label='Water (glasses)'
              type='number'
              name='water'
              value={formData.water}
              onChange={handleChange}
              placeholder='8'
              step='0.5'
              min='0'
              max='10'
            />

            <Input
              label='Mood (1-10)'
              type='number'
              name='mood'
              value={formData.mood}
              onChange={handleChange}
              placeholder='7'
              min='1'
              max='10'
            />
          </div>

          <div className='flex gap-4 mt-6'>
            <Button
              type='submit'
              disabled={isLoading}
              variant='primary'
              className='flex-1'
            >
              {isLoading ? <LoadingSpinner /> : 'Save Entry'}
            </Button>
            <Button
              type='button'
              onClick={() => navigate('/dashboard')}
              variant='secondary'
              className='flex-1'
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEntry;
