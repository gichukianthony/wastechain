import React, { useState, useEffect } from 'react';
import { getWasteRequests, createWasteRequest } from '../services/api';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';

const WasteRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Plastic',
    weight: '',
    address: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getWasteRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWasteRequest(formData);
      setShowModal(false);
      fetchRequests(); // Ideally reload or append to list
      // Since it's mock, we might need to manually add to state if API doesn't persist
      setRequests([
          { id: Date.now(), ...formData, status: 'PENDING', date: new Date().toISOString().split('T')[0] },
          ...requests
      ]);
      setFormData({ type: 'Plastic', weight: '', address: '' });
    } catch (error) {
      console.error("Failed to create request", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Waste Collection Requests</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus size={20} /> New Request
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 font-medium text-gray-900">
                <tr>
                  <th className="px-6 py-4">Waste Type</th>
                  <th className="px-6 py-4">Est. Weight (kg)</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{req.type}</td>
                    <td className="px-6 py-4">{req.weight}</td>
                    <td className="px-6 py-4">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'COLLECTED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Trash2 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
            <p className="mt-1">Get started by creating a new waste collection request.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Pickup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option>Plastic</option>
                  <option>Paper</option>
                  <option>Glass</option>
                  <option>Metal</option>
                  <option>Electronics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                <textarea
                   required
                   value={formData.address}
                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none"
                   placeholder="Enter your full address"
                   rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteRequests;
