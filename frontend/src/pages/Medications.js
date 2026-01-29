import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Button, Input, Select, Alert } from '../components/UI';

const Medications = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once daily',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchMedications();
  }, [token]);

  const fetchMedications = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/medications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMedications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch medications');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create medication');

      setSuccess('Medication added!');
      setFormData({ name: '', dosage: '', frequency: 'once daily', reason: '', notes: '' });
      setShowForm(false);
      fetchMedications();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedication = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/medications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMedications();
    } catch (err) {
      setError('Failed to delete medication');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <nav className='bg-white shadow p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Medications</h1>
        <button onClick={() => navigate('/dashboard')} className='text-blue-600 hover:text-blue-800'>Back</button>
      </nav>

      <div className='max-w-4xl mx-auto p-6'>
        {error && <Alert type='error' message={error} onClose={() => setError('')} />}
        {success && <Alert type='success' message={success} onClose={() => setSuccess('')} />}

        <Button onClick={() => setShowForm(!showForm)} variant='primary' className='mb-6'>
          {showForm ? 'Cancel' : 'Add Medication'}
        </Button>

        {showForm && (
          <Card className='mb-6'>
            <h2 className='text-xl font-bold mb-4'>Add a New Medication</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label='Medication Name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='e.g., Aspirin'
                required
              />
              <Input
                label='Dosage'
                name='dosage'
                value={formData.dosage}
                onChange={handleChange}
                placeholder='e.g., 500mg'
              />
              <Select
                label='Frequency'
                name='frequency'
                value={formData.frequency}
                onChange={handleChange}
                options={[
                  { value: 'once daily', label: 'Once Daily' },
                  { value: 'twice daily', label: 'Twice Daily' },
                  { value: 'three times daily', label: 'Three Times Daily' },
                  { value: 'as needed', label: 'As Needed' }
                ]}
              />
              <Input
                label='Reason for Taking'
                name='reason'
                value={formData.reason}
                onChange={handleChange}
                placeholder='e.g., Pain relief'
              />
              <Input
                label='Notes'
                name='notes'
                value={formData.notes}
                onChange={handleChange}
                placeholder='Any additional notes'
              />
              <Button type='submit' variant='primary' disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Medication'}
              </Button>
            </form>
          </Card>
        )}

        <div className='space-y-4'>
          {medications.map((med) => (
            <Card key={med._id}>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-lg font-bold text-gray-800'>{med.name}</h3>
                  <p className='text-gray-600'>{med.dosage} - {med.frequency}</p>
                  <p className='text-gray-500 text-sm mt-2'>{med.reason}</p>
                  {med.notes && <p className='text-gray-500 text-sm italic'>Notes: {med.notes}</p>}
                </div>
                <button
                  onClick={() => deleteMedication(med._id)}
                  className='text-red-500 hover:text-red-700'
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>

        {medications.length === 0 && !showForm && (
          <Card>
            <p className='text-center text-gray-500'>No medications tracked yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Medications;
