import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Button, Input, Select, Alert } from '../components/UI';

const Symptoms = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [symptoms, setSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    symptoms: [],
    severity: 5,
    stressLevel: 5,
    description: '',
    duration: '',
    actionTaken: ''
  });

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Body Ache',
    'Sore Throat', 'Runny Nose', 'Dizziness', 'Nausea', 'Shortness of Breath'
  ];

  useEffect(() => {
    fetchSymptoms();
  }, [token]);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/symptoms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setSymptoms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch symptoms');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to record symptoms');

      setSuccess('Symptoms recorded!');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        symptoms: [],
        severity: 5,
        stressLevel: 5,
        description: '',
        duration: '',
        actionTaken: ''
      });
      setShowForm(false);
      fetchSymptoms();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSymptom = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/symptoms/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSymptoms();
    } catch (err) {
      setError('Failed to delete symptom record');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <nav className='bg-white shadow p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Symptom Checker</h1>
        <button onClick={() => navigate('/dashboard')} className='text-blue-600 hover:text-blue-800'>Back</button>
      </nav>

      <div className='max-w-4xl mx-auto p-6'>
        {error && <Alert type='error' message={error} onClose={() => setError('')} />}
        {success && <Alert type='success' message={success} onClose={() => setSuccess('')} />}

        <Button onClick={() => setShowForm(!showForm)} variant='primary' className='mb-6'>
          {showForm ? 'Cancel' : 'Record Symptoms'}
        </Button>

        {showForm && (
          <Card className='mb-6'>
            <h2 className='text-xl font-bold mb-4'>Record Symptoms</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label='Date'
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                required
              />

              <div className='mb-4'>
                <label className='block text-sm font-semibold text-gray-700 mb-3'>Select Symptoms</label>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                  {commonSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      type='button'
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-2 rounded border ${
                        formData.symptoms.includes(symptom)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Severity (1-10): <strong>{formData.severity}</strong>
                </label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  name='severity'
                  value={formData.severity}
                  onChange={handleChange}
                  className='w-full'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Stress Level (1-10): <strong>{formData.stressLevel}</strong>
                </label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  name='stressLevel'
                  value={formData.stressLevel}
                  onChange={handleChange}
                  className='w-full'
                />
              </div>

              <Input
                label='Description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Describe your symptoms...'
              />

              <Input
                label='Duration'
                name='duration'
                value={formData.duration}
                onChange={handleChange}
                placeholder='e.g., 2 days, 1 week'
              />

              <Input
                label='Action Taken'
                name='actionTaken'
                value={formData.actionTaken}
                onChange={handleChange}
                placeholder='What did you do about it?'
              />

              <Button type='submit' variant='primary' disabled={isLoading}>
                {isLoading ? 'Recording...' : 'Record Symptoms'}
              </Button>
            </form>
          </Card>
        )}

        <div className='space-y-4'>
          {symptoms.map((symptom) => (
            <Card key={symptom._id}>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <p className='text-gray-600 text-sm'>
                    {new Date(symptom.date).toLocaleDateString()}
                  </p>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {symptom.symptoms.map(s => (
                      <span key={s} className='bg-red-100 text-red-800 px-2 py-1 rounded text-sm'>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => deleteSymptom(symptom._id)}
                  className='text-red-500 hover:text-red-700'
                >
                  Delete
                </button>
              </div>
              <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                <p>Severity: <strong>{symptom.severity}/10</strong></p>
                <p>Stress: <strong>{symptom.stressLevel}/10</strong></p>
                {symptom.duration && <p>Duration: {symptom.duration}</p>}
              </div>
              {symptom.description && <p className='text-gray-700 mt-2'>{symptom.description}</p>}
              {symptom.actionTaken && <p className='text-gray-600 text-sm mt-2 italic'>Action: {symptom.actionTaken}</p>}
            </Card>
          ))}
        </div>

        {symptoms.length === 0 && !showForm && (
          <Card>
            <p className='text-center text-gray-500'>No symptoms recorded yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Symptoms;
