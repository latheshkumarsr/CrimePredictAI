import React from 'react';
import { FileText, Database, Columns } from 'lucide-react';

interface DatasetInfo {
  name: string;
  size: number;
  rows: number;
  columns: string[];
  preview: any[];
}

interface DatasetPreviewProps {
  datasetInfo: DatasetInfo;
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ datasetInfo }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dataset Information</h2>
      
      {/* Dataset Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">File Name</p>
            <p className="font-semibold text-gray-900">{datasetInfo.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
          <Database className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Records</p>
            <p className="font-semibold text-gray-900">{datasetInfo.rows.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
          <Columns className="h-8 w-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">File Size</p>
            <p className="font-semibold text-gray-900">{formatFileSize(datasetInfo.size)}</p>
          </div>
        </div>
      </div>

      {/* Columns Detected */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Columns Detected</h3>
        <div className="flex flex-wrap gap-2">
          {datasetInfo.columns.map((column, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {column}
            </span>
          ))}
        </div>
      </div>

      {/* Data Preview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {datasetInfo.columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datasetInfo.preview.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {datasetInfo.columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[column] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatasetPreview;