'use client';

import React, { useEffect, useState } from 'react';
import { checkApiHealth, HealthResponse } from '@/lib/api';
import { Server, Database, Cloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function SystemHealthBanner() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await checkApiHealth();
      setHealth(data);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm text-left">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6DBE82] animate-pulse" />
          <h2 className="text-base font-bold text-[#2B2B2B] uppercase tracking-wide">
            Platform Infrastructure & Connectivity Status
          </h2>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-[#FAF6EA] border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && !health && !error && (
        <div className="py-6 text-center text-sm font-medium text-gray-500">
          Probing API and Database status...
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>Backend Offline: {error}. Ensure backend is running on port 5001.</span>
        </div>
      )}

      {health && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Frontend <-> Backend */}
          <div className="p-3.5 bg-[#FAF6EA] border border-[#8FD19E]/50 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-600 uppercase">Backend API</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-green-700" />
                Online
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Server className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm font-bold text-[#2B2B2B]">{health.service}</p>
                <p className="text-xs text-gray-500">Uptime: {health.uptimeSeconds}s</p>
              </div>
            </div>
          </div>

          {/* Backend <-> Database */}
          <div className="p-3.5 bg-[#FAF6EA] border border-[#8FD19E]/50 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-600 uppercase">MongoDB Atlas</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  health.database.connected
                    ? 'text-green-800 bg-green-100'
                    : 'text-red-800 bg-red-100'
                }`}
              >
                {health.database.connected ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-green-700" />
                    Connected
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-red-700" />
                    Disconnected
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Database className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm font-bold text-[#2B2B2B]">
                  {health.database.database || 'kissan_mandi'}
                </p>
                <p className="text-xs text-gray-500">
                  Latency: {health.database.latencyMs !== null ? `${health.database.latencyMs}ms` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Storage / Cloudinary */}
          <div className="p-3.5 bg-[#FAF6EA] border border-[#8FD19E]/50 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-600 uppercase">Storage</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-green-700" />
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Cloud className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm font-bold text-[#2B2B2B]">{health.storage.provider}</p>
                <p className="text-xs text-gray-500">
                  {health.storage.configured ? 'Cloud Verified' : 'Local Fallback'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
