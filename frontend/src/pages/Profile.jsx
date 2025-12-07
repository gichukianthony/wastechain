import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, MapPin, Phone } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary/10 h-32 w-full relative">
            <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <User size={40} />
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-16 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-500 capitalize">{user.role}</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Information</h3>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                         <Phone className="w-5 h-5 text-gray-400" />
                         <span>+1 (555) 123-4567</span>
                    </div>
                </div>

                <div className="space-y-4">
                     <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Account Details</h3>

                     <div className="flex items-center gap-3 text-gray-600">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="capitalize">{user.role} Account</span>
                     </div>
                     <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>San Francisco, CA</span>
                     </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors">
                    Edit Profile
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
