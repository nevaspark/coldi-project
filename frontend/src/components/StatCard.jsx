import React from 'react';

export default function StatCard({ title, value, sub }) {
  return (
    <div className="card">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
      {sub && <div className="mt-1 text-gray-500 text-sm">{sub}</div>}
    </div>
  )
}
