import React, { useState, useEffect } from 'react';
import { getRewards, getUserRewards } from '../services/api';
import { Gift, Award } from 'lucide-react';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const rewardsData = await getRewards();
            const userRewardsData = await getUserRewards();
            setRewards(rewardsData);
            setUserPoints(userRewardsData.points);
        } catch (error) {
            console.error("Error fetching rewards", error);
        }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
                <h1 className="text-3xl font-bold mb-2">Rewards Center</h1>
                <p className="text-purple-100">Redeem your GreenPoints for amazing rewards.</p>
             </div>
             <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="p-3 bg-yellow-400 rounded-full text-yellow-900">
                    <Award size={32} />
                </div>
                <div>
                    <p className="text-sm text-purple-200 font-medium">Your Balance</p>
                    <p className="text-3xl font-bold">{userPoints} <span className="text-lg font-normal">pts</span></p>
                </div>
             </div>
         </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900">Available Rewards</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-40 bg-purple-50 flex items-center justify-center">
                <Gift className="w-16 h-16 text-purple-300" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.title}</h3>
              <p className="text-gray-500 text-sm mb-4 flex-1">{reward.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                 <span className="font-bold text-purple-600 text-lg">{reward.cost} pts</span>
                 <button
                    disabled={userPoints < reward.cost}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        userPoints >= reward.cost
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                 >
                    Redeem
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
