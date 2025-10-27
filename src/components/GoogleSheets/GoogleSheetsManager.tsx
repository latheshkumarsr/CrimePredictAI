import React, { useState } from 'react';
import { googleSheetsService, CrimeRecord } from '../../services/googleSheetsService';
import { googleSheetsExamples } from '../../utils/googleSheetsExamples';
import { Database, Plus, Edit, Trash2, RefreshCw, Info, Upload, Download } from 'lucide-react';

const GoogleSheetsManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [records, setRecords] = useState<CrimeRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CrimeRecord | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleReadData = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsExamples.readAllData();
      setRecords(data);
      showMessage('success', `Successfully loaded ${data.length} records`);
    } catch (error) {
      showMessage('error', 'Failed to read data from Google Sheets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSampleData = async () => {
    setIsLoading(true);
    try {
      await googleSheetsExamples.addRecords();
      showMessage('success', 'Sample records added successfully');
      await handleReadData(); // Refresh data
    } catch (error) {
      showMessage('error', 'Failed to add sample records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeSheet = async () => {
    setIsLoading(true);
    try {
      await googleSheetsExamples.initializeSheet();
      showMessage('success', 'Sheet initialized with headers');
    } catch (error) {
      showMessage('error', 'Failed to initialize sheet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSheetInfo = async () => {
    setIsLoading(true);
    try {
      const info = await googleSheetsExamples.getSheetInfo();
      showMessage('info', `Sheet: ${info.properties?.title}, Sheets: ${info.sheets?.length}`);
    } catch (error) {
      showMessage('error', 'Failed to get sheet information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRecord = async (recordId: string) => {
    setIsLoading(true);
    try {
      await googleSheetsExamples.updateRecord(recordId);
      showMessage('success', 'Record updated successfully');
      await handleReadData(); // Refresh data
    } catch (error) {
      showMessage('error', 'Failed to update record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    setIsLoading(true);
    try {
      await googleSheetsExamples.deleteRecord(recordId);
      showMessage('success', 'Record deleted successfully');
      await handleReadData(); // Refresh data
    } catch (error) {
      showMessage('error', 'Failed to delete record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkOperations = async () => {
    if (!confirm('This will clear all data and add sample records. Continue?')) return;
    
    setIsLoading(true);
    try {
      await googleSheetsExamples.bulkOperations();
      showMessage('success', 'Bulk operations completed successfully');
      await handleReadData(); // Refresh data
    } catch (error) {
      showMessage('error', 'Failed to complete bulk operations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Database className="h-6 w-6 mr-2 text-blue-600" />
          Google Sheets Database Manager
        </h2>
        <div className="text-sm text-gray-500">
          Live connection to Google Sheets
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={handleInitializeSheet}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Database className="h-4 w-4" />
          <span>Initialize</span>
        </button>

        <button
          onClick={handleReadData}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Load Data</span>
        </button>

        <button
          onClick={handleAddSampleData}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Sample</span>
        </button>

        <button
          onClick={handleGetSheetInfo}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Info className="h-4 w-4" />
          <span>Sheet Info</span>
        </button>
      </div>

      {/* Bulk Operations */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Bulk Operations</h3>
        <p className="text-yellow-700 text-sm mb-3">
          Clear all existing data and populate with sample crime records
        </p>
        <button
          onClick={handleBulkOperations}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset & Populate</span>
        </button>
      </div>

      {/* Records Display */}
      {records.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Crime Records ({records.length} total)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crime Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.slice(0, 10).map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.date} {record.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.crime_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        record.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        record.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {record.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleUpdateRecord(record.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {records.length > 10 && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Showing first 10 records of {records.length} total
            </p>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="text-gray-800">Processing Google Sheets operation...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsManager;