import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, TrendingUp, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full text-center py-20 px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
          Link Waste to <span className="text-primary">Worth</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
          WasteChain connects households, collectors, and recyclers to create a sustainable future.
          Turn your waste into opportunities and rewards.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold text-lg transition-colors flex items-center gap-2">
            Get Started <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-8 py-3 rounded-full font-bold text-lg transition-colors">
            Login
          </Link>
        </div>
      </section>

      <section className="w-full max-w-7xl px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Recycle className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Recycling</h3>
          <p className="text-gray-500">
            Request pickups and track your recycling impact in real-time.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-secondary w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Community Driven</h3>
          <p className="text-gray-500">
            Connect with local collectors and recyclers in a transparent network.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-purple-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Earn Rewards</h3>
          <p className="text-gray-500">
            Get GreenPoints for every verified recycling action and redeem them.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
