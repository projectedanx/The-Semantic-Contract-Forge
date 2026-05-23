import React, { useState, useMemo } from 'react';

/**
 * @file components/AdminDashboard.tsx
 * @description Exclusive administrative user frontend for multi-user instances.
 * Displays system metrics, query logs, and user access controls.
 */

// Local mock data representing the multi-user backend state
const MOCK_USERS = [
  { id: 'u-1', email: 'admin@forge.internal', role: 'admin', tier: 'enterprise', status: 'active', lastLogin: '2025-05-23T01:14:00Z' },
  { id: 'u-2', email: 'researcher@inst.edu', role: 'user', tier: 'pro', status: 'active', lastLogin: '2025-05-22T14:22:00Z' },
  { id: 'u-3', email: 'dev@startup.io', role: 'user', tier: 'starter', status: 'inactive', lastLogin: '2025-05-10T09:05:00Z' },
];

const MOCK_METRICS = {
  activeInstances: 142,
  totalQueries24h: 8405,
  avgLatencyMs: 245,
  errorRate: 0.012, // 1.2%
};

const MOCK_LOGS = [
  { id: 'log-1', type: 'INFO', message: 'User u-2 successfully validated strict JSON schema', timestamp: '2025-05-23T02:15:22Z' },
  { id: 'log-2', type: 'WARN', message: 'VULCAN Guard blocked unauthorized mutation attempt from u-3', timestamp: '2025-05-23T02:10:05Z' },
  { id: 'log-3', type: 'ERROR', message: 'Gemini API Rate Limit exceeded for instance pool-A', timestamp: '2025-05-23T01:55:12Z' },
  { id: 'log-4', type: 'INFO', message: 'Admin authenticated from authorized IP address', timestamp: '2025-05-23T01:14:00Z' },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'logs'>('metrics');

  const renderMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-slate-400 mb-1">Active Instances</h3>
        <p className="text-3xl font-bold text-cyan-400">{MOCK_METRICS.activeInstances}</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-slate-400 mb-1">Queries (24h)</h3>
        <p className="text-3xl font-bold text-amber-400">{MOCK_METRICS.totalQueries24h}</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-slate-400 mb-1">Avg Latency (ms)</h3>
        <p className="text-3xl font-bold text-emerald-400">{MOCK_METRICS.avgLatencyMs}</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-slate-400 mb-1">Error Rate</h3>
        <p className="text-3xl font-bold text-red-400">{(MOCK_METRICS.errorRate * 100).toFixed(1)}%</p>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">User ID</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Tier</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{user.id}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize">{user.tier}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{new Date(user.lastLogin).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden font-mono text-xs">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
        <h3 className="font-semibold text-slate-300">System Activity Trace</h3>
        <button className="text-cyan-400 hover:text-cyan-300 transition-colors">Export Logs</button>
      </div>
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {MOCK_LOGS.map((log) => {
          let colorClass = 'text-slate-400';
          if (log.type === 'ERROR') colorClass = 'text-red-400';
          if (log.type === 'WARN') colorClass = 'text-amber-400';
          if (log.type === 'INFO') colorClass = 'text-cyan-400';

          return (
            <div key={log.id} className="flex space-x-4 p-2 hover:bg-slate-800/50 rounded transition-colors">
              <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toISOString()}</span>
              <span className={`font-bold shrink-0 w-12 ${colorClass}`}>[{log.type}]</span>
              <span className="text-slate-300 truncate">{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="mb-8 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold font-orbitron text-amber-400 flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Instance Administration
        </h2>
        <p className="text-slate-400 mt-2">Manage multi-user access, monitor system metrics, and inspect operation traces.</p>
      </div>

      <div className="flex space-x-1 mb-6 bg-slate-800/50 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'metrics' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          System Metrics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'users' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Access Control
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'logs' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Activity Logs
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'metrics' && renderMetrics()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'logs' && renderLogs()}
      </div>
    </div>
  );
};

export default AdminDashboard;
