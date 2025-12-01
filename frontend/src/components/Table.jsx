import React from 'react';

export default function Table({ columns, rows }) {
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-gray-400">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="text-left font-medium py-2 pr-4">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className="border-t border-gray-800">
              {r.map((cell, i) => (
                <td key={i} className="py-2 pr-4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
