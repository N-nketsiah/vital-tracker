import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Button, Input, Select, Alert } from '../components/UI';

const Meals = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    mealType: '',
    foodItems: [{ name: '', quantity: '', calories: 0 }],
    notes: ''
  });

  useEffect(() => {
    fetchMeals();
  }, [token, selectedDate]);

  const fetchMeals = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/meals/date/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMeals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch meals');
    }
  };

  const handleMealTypeChange = (e) => {
    setFormData(prev => ({ ...prev, mealType: e.target.value }));
  };

  const handleFoodItemChange = (index, field, value) => {
    const newItems = [...formData.foodItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, foodItems: newItems }));
  };

  const addFoodItem = () => {
    setFormData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, { name: '', quantity: '', calories: 0 }]
    }));
  };

  const removeFoodItem = (index) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, date: new Date(selectedDate) })
      });

      if (!response.ok) throw new Error('Failed to create meal');

      setSuccess('Meal logged!');
      setFormData({ mealType: '', foodItems: [{ name: '', quantity: '', calories: 0 }], notes: '' });
      setShowForm(false);
      fetchMeals();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/meals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMeals();
    } catch (err) {
      setError('Failed to delete meal');
    }
  };

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <nav className='bg-white shadow p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Food & Nutrition</h1>
        <button onClick={() => navigate('/dashboard')} className='text-blue-600 hover:text-blue-800'>Back</button>
      </nav>

      <div className='max-w-4xl mx-auto p-6'>
        {error && <Alert type='error' message={error} onClose={() => setError('')} />}
        {success && <Alert type='success' message={success} onClose={() => setSuccess('')} />}

        <div className='mb-6'>
          <Input
            label='Select Date'
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <p className='text-gray-500 text-sm'>Total Calories</p>
            <p className='text-3xl font-bold text-blue-600'>{totalCalories}</p>
          </Card>
        </div>

        <Button onClick={() => setShowForm(!showForm)} variant='primary' className='mb-6'>
          {showForm ? 'Cancel' : 'Log Meal'}
        </Button>

        {showForm && (
          <Card className='mb-6'>
            <h2 className='text-xl font-bold mb-4'>Log a Meal</h2>
            <form onSubmit={handleSubmit}>
              <Select
                label='Meal Type'
                value={formData.mealType}
                onChange={handleMealTypeChange}
                options={[
                  { value: 'breakfast', label: 'Breakfast' },
                  { value: 'lunch', label: 'Lunch' },
                  { value: 'dinner', label: 'Dinner' },
                  { value: 'snack', label: 'Snack' }
                ]}
                required
              />

              <div className='mb-4'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Food Items</label>
                {formData.foodItems.map((item, index) => (
                  <div key={index} className='mb-3 p-3 bg-gray-50 rounded'>
                    <div className='grid grid-cols-4 gap-2 mb-2'>
                      <Input
                        placeholder='Food name'
                        value={item.name}
                        onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder='Quantity'
                        value={item.quantity}
                        onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)}
                      />
                      <Input
                        type='number'
                        placeholder='Calories'
                        value={item.calories}
                        onChange={(e) => handleFoodItemChange(index, 'calories', parseInt(e.target.value))}
                      />
                      <button
                        type='button'
                        onClick={() => removeFoodItem(index)}
                        className='text-red-500 hover:text-red-700 text-sm font-bold'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <Button type='button' onClick={addFoodItem} variant='secondary'>
                  + Add Food Item
                </Button>
              </div>

              <Input
                label='Notes'
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder='Any notes about this meal'
              />

              <Button type='submit' variant='primary' disabled={isLoading}>
                {isLoading ? 'Logging...' : 'Log Meal'}
              </Button>
            </form>
          </Card>
        )}

        <div className='space-y-4'>
          {meals.map((meal) => (
            <Card key={meal._id}>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-lg font-bold text-gray-800 capitalize'>{meal.mealType}</h3>
                  <p className='text-gray-600'>{meal.foodItems.length} items</p>
                  <p className='text-blue-600 font-bold mt-2'>{meal.totalCalories} calories</p>
                  {meal.notes && <p className='text-gray-500 text-sm italic mt-2'>{meal.notes}</p>}
                </div>
                <button
                  onClick={() => deleteMeal(meal._id)}
                  className='text-red-500 hover:text-red-700'
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>

        {meals.length === 0 && !showForm && (
          <Card>
            <p className='text-center text-gray-500'>No meals logged for this date.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Meals;
