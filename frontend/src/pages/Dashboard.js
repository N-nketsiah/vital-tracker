import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useHealthStore from '../store/healthStore';
import { Card, Button, StatCard, LoadingSpinner, Alert } from '../components/UI';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const { stats, insights, entries, isLoading, error, fetchStats, fetchInsights, fetchEntries } = useHealthStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([fetchEntries(token), fetchStats(token), fetchInsights(token)]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    loadData();
  }, [token, navigate, fetchStats, fetchInsights, fetchEntries]);

  if (!user) {
    return <LoadingSpinner />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 py-6 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>VitalTrack</h1>
            <p className='text-gray-600'>Welcome, {user.name}</p>
          </div>
          <div className='flex gap-4'>
            <Button onClick={() => navigate('/add-entry')} variant='primary'>
              + Add Entry
            </Button>
            <Button onClick={() => navigate('/settings')} variant='secondary'>
              Settings
            </Button>
            <Button onClick={handleLogout} variant='danger'>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {error && <Alert type='error' message={error} />}

      {/* Navigation Tabs */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 flex gap-8'>
          {['overview', 'insights', 'trends', 'export'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {activeTab === 'overview' && (
          <div>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Health Overview</h2>

            {/* Quick Access to New Features */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
              <Card className='hover:shadow-lg cursor-pointer transition' onClick={() => navigate('/goals')}>
                <div className='text-3xl mb-2'>🎯</div>
                <h3 className='font-bold text-gray-800'>Health Goals</h3>
                <p className='text-sm text-gray-600'>Set and track health targets</p>
              </Card>
              <Card className='hover:shadow-lg cursor-pointer transition' onClick={() => navigate('/medications')}>
                <div className='text-3xl mb-2'>💊</div>
                <h3 className='font-bold text-gray-800'>Medications</h3>
                <p className='text-sm text-gray-600'>Track medication intake</p>
              </Card>
              <Card className='hover:shadow-lg cursor-pointer transition' onClick={() => navigate('/doctor-notes')}>
                <div className='text-3xl mb-2'>📋</div>
                <h3 className='font-bold text-gray-800'>Doctor Notes</h3>
                <p className='text-sm text-gray-600'>Store doctor visit records</p>
              </Card>
              <Card className='hover:shadow-lg cursor-pointer transition' onClick={() => navigate('/meals')}>
                <div className='text-3xl mb-2'>🍎</div>
                <h3 className='font-bold text-gray-800'>Nutrition</h3>
                <p className='text-sm text-gray-600'>Log meals and calories</p>
              </Card>
              <Card className='hover:shadow-lg cursor-pointer transition' onClick={() => navigate('/symptoms')}>
                <div className='text-3xl mb-2'>🤒</div>
                <h3 className='font-bold text-gray-800'>Symptoms</h3>
                <p className='text-sm text-gray-600'>Track symptoms and stress</p>
              </Card>
              <Card className='hover:shadow-lg cursor-pointer transition' onClick={() => navigate('/achievements')}>
                <div className='text-3xl mb-2'>🏆</div>
                <h3 className='font-bold text-gray-800'>Achievements</h3>
                <p className='text-sm text-gray-600'>View earned badges</p>
              </Card>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : stats ? (
              <div>
                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                  {stats.heartRate && (
                    <StatCard
                      title='Heart Rate'
                      value={stats.heartRate.avg.toFixed(0)}
                      unit='bpm'
                    />
                  )}
                  {stats.weight && (
                    <StatCard
                      title='Weight'
                      value={stats.weight.avg.toFixed(1)}
                      unit='kg'
                    />
                  )}
                  {stats.sleep && (
                    <StatCard
                      title='Sleep'
                      value={stats.sleep.avg.toFixed(1)}
                      unit='hrs'
                    />
                  )}
                  {stats.steps && (
                    <StatCard
                      title='Steps'
                      value={(stats.steps.avg / 1000).toFixed(1)}
                      unit='k'
                    />
                  )}
                </div>

                {/* Recent Entries Chart */}
                {entries.length > 0 && (
                  <Card className='mb-8'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Recent Trends</h3>
                    <ResponsiveContainer width='100%' height={300}>
                      <LineChart data={entries.slice(0, 10).reverse()}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type='monotone' dataKey='weight' stroke='#8884d8' name='Weight' />
                        <Line type='monotone' dataKey='heartRate' stroke='#82ca9d' name='Heart Rate' />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </div>
            ) : (
              <Alert type='info' message='No health data available. Start by adding your first entry!' />
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Health Insights</h2>
            {insights.length > 0 ? (
              <div className='grid gap-4'>
                {insights.map((insight, idx) => (
                  <Card key={idx} className={`border-l-4 ${
                    insight.severity === 'high' ? 'border-red-500' : 
                    insight.severity === 'medium' ? 'border-yellow-500' : 
                    'border-blue-500'
                  }`}>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold text-lg text-gray-800'>{insight.category}</h3>
                        <p className='text-gray-600 mt-2'>{insight.message}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        insight.severity === 'high' ? 'bg-red-100 text-red-800' :
                        insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {insight.type}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert type='info' message='No insights available yet. Keep adding health entries to get personalized insights!' />
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Trends Analysis</h2>
            <Card>
              <p className='text-gray-600'>Advanced trend analysis coming soon. Continue tracking your health data to build a comprehensive history.</p>
            </Card>
          </div>
        )}

        {activeTab === 'export' && (
          <div>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Export Data</h2>
            <Card>
              <p className='text-gray-700 mb-6'>Download your health data in your preferred format:</p>
              <div className='flex gap-4'>
                <Button
                  onClick={() => useHealthStore.getState().exportCSV(token)}
                  variant='primary'
                >
                  📊 Export as CSV
                </Button>
                <Button
                  onClick={() => useHealthStore.getState().exportPDF(token)}
                  variant='secondary'
                >
                  📄 Export as PDF
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
