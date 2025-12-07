import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Waste Recycled', value: '125 kg', icon: Trash2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'GreenPoints Earned', value: '750', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pending Requests', value: '2', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Estimated Savings', value: '$45.00', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
           <p className="text-gray-500">Welcome back, {user?.firstName}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
             {/* Mock activity */}
             {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <Trash2 size={20} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Plastic Collection Request</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <span className="ml-auto text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Pending</span>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
                 <button className="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group">
                    <Trash2 className="w-6 h-6 text-gray-400 group-hover:text-primary mb-2" />
                    <span className="font-medium text-gray-900 block">Request Pickup</span>
                 </button>
                 <button className="p-4 border border-gray-200 rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all text-left group">
                    <TrendingUp className="w-6 h-6 text-gray-400 group-hover:text-secondary mb-2" />
                    <span className="font-medium text-gray-900 block">View Rewards</span>
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
