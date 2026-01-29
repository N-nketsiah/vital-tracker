import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Card, Alert } from '../components/UI';

const Achievements = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAchievements();
  }, [token]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/achievements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch achievements');
    }
  };

  const badgeEmojis = {
    'streak': '🔥',
    'milestone': '🏆',
    'consistency': '⭐',
    'health': '💪',
    'nutrition': '🥗',
    'exercise': '🏃',
    'sleep': '😴',
    'meditation': '🧘'
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <nav className='bg-white shadow p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Achievements & Badges</h1>
        <button onClick={() => navigate('/dashboard')} className='text-blue-600 hover:text-blue-800'>Back</button>
      </nav>

      <div className='max-w-6xl mx-auto p-6'>
        {error && <Alert type='error' message={error} onClose={() => setError('')} />}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {achievements.map((achievement) => (
            <Card key={achievement._id} className='text-center hover:shadow-lg transition'>
              <div className='text-6xl mb-4'>
                {badgeEmojis[achievement.achievementType] || '⭐'}
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>{achievement.title}</h3>
              <p className='text-gray-600 mb-3'>{achievement.description}</p>
              <p className='text-sm text-gray-500'>
                Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
              </p>
              {achievement.progress && (
                <div className='mt-3'>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-yellow-400 h-2 rounded-full'
                      style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                    />
                  </div>
                  <p className='text-xs text-gray-600 mt-1'>{achievement.progress}% progress</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {achievements.length === 0 && (
          <Card className='text-center py-12'>
            <p className='text-xl text-gray-500 mb-2'>No achievements unlocked yet</p>
            <p className='text-gray-400'>Keep logging your health data to earn badges!</p>
          </Card>
        )}

        <div className='mt-12 bg-white rounded-lg shadow p-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>How to Unlock Badges</h2>
          <ul className='space-y-3 text-gray-700'>
            <li className='flex items-start'>
              <span className='text-2xl mr-3'>🔥</span>
              <span><strong>Streak Master:</strong> Log health entries for 7+ consecutive days</span>
            </li>
            <li className='flex items-start'>
              <span className='text-2xl mr-3'>🏆</span>
              <span><strong>Milestone Maker:</strong> Complete a health goal</span>
            </li>
            <li className='flex items-start'>
              <span className='text-2xl mr-3'>⭐</span>
              <span><strong>Consistent Care:</strong> Maintain 30+ days of consistent logging</span>
            </li>
            <li className='flex items-start'>
              <span className='text-2xl mr-3'>💪</span>
              <span><strong>Health Hero:</strong> Complete 3+ health goals in a month</span>
            </li>
            <li className='flex items-start'>
              <span className='text-2xl mr-3'>🥗</span>
              <span><strong>Nutrition Master:</strong> Log 20+ meals</span>
            </li>
            <li className='flex items-start'>
              <span className='text-2xl mr-3'>🏃</span>
              <span><strong>Active Explorer:</strong> Reach 50,000 total steps</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
