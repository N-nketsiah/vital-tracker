import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Button, Input, Alert } from '../components/UI';

const DoctorNotes = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    visitDate: '',
    diagnosis: '',
    notes: '',
    prescription: '',
    followUp: ''
  });

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/doctor-notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch doctor notes');
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
      const response = await fetch('http://localhost:5001/api/doctor-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create note');

      setSuccess('Doctor note added!');
      setFormData({ doctorName: '', visitDate: '', diagnosis: '', notes: '', prescription: '', followUp: '' });
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/doctor-notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <nav className='bg-white shadow p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Doctor Notes</h1>
        <button onClick={() => navigate('/dashboard')} className='text-blue-600 hover:text-blue-800'>Back</button>
      </nav>

      <div className='max-w-4xl mx-auto p-6'>
        {error && <Alert type='error' message={error} onClose={() => setError('')} />}
        {success && <Alert type='success' message={success} onClose={() => setSuccess('')} />}

        <Button onClick={() => setShowForm(!showForm)} variant='primary' className='mb-6'>
          {showForm ? 'Cancel' : 'Add Doctor Visit'}
        </Button>

        {showForm && (
          <Card className='mb-6'>
            <h2 className='text-xl font-bold mb-4'>Record Doctor Visit</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label='Doctor Name'
                name='doctorName'
                value={formData.doctorName}
                onChange={handleChange}
                placeholder='Dr. John Smith'
              />
              <Input
                label='Visit Date'
                type='date'
                name='visitDate'
                value={formData.visitDate}
                onChange={handleChange}
                required
              />
              <Input
                label='Diagnosis'
                name='diagnosis'
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder='What was the diagnosis?'
              />
              <Input
                label='Notes'
                name='notes'
                value={formData.notes}
                onChange={handleChange}
                placeholder='Details about the visit...'
                required
              />
              <Input
                label='Prescription'
                name='prescription'
                value={formData.prescription}
                onChange={handleChange}
                placeholder='Prescribed medications'
              />
              <Input
                label='Follow-up Date'
                type='date'
                name='followUp'
                value={formData.followUp}
                onChange={handleChange}
              />
              <Button type='submit' variant='primary' disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Visit'}
              </Button>
            </form>
          </Card>
        )}

        <div className='space-y-4'>
          {notes.map((note) => (
            <Card key={note._id}>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <h3 className='text-lg font-bold text-gray-800'>{note.doctorName || 'Doctor Visit'}</h3>
                  <p className='text-gray-600 text-sm'>
                    {new Date(note.visitDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteNote(note._id)}
                  className='text-red-500 hover:text-red-700'
                >
                  Delete
                </button>
              </div>
              {note.diagnosis && <p className='text-gray-700 mb-2'><strong>Diagnosis:</strong> {note.diagnosis}</p>}
              <p className='text-gray-700 mb-2'><strong>Notes:</strong> {note.notes}</p>
              {note.prescription && <p className='text-gray-600 mb-2'><strong>Rx:</strong> {note.prescription}</p>}
              {note.followUp && <p className='text-gray-600 text-sm'><strong>Follow-up:</strong> {new Date(note.followUp).toLocaleDateString()}</p>}
            </Card>
          ))}
        </div>

        {notes.length === 0 && !showForm && (
          <Card>
            <p className='text-center text-gray-500'>No doctor notes yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorNotes;
