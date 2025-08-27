import React from 'react';
import { useData } from '../../context/DataContext';
import { Database, ChevronDown } from 'lucide-react';

const DatasetSelector = () => {
  const { currentDataset, availableDatasets, selectDataset, isLoading } = useData();

  if (availableDatasets.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <select
        value={currentDataset?.id || ''}
        onChange={(e) => selectDataset(e.target.value)}
        disabled={isLoading}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {availableDatasets.map((dataset) => (
          <option key={dataset.id} value={dataset.id}>
            {dataset.name} ({dataset.rows.toLocaleString()} records)
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default DatasetSelector;