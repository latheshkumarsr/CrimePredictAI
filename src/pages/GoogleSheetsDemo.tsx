import React from 'react';
import GoogleSheetsManager from '../components/GoogleSheets/GoogleSheetsManager';
import { Database, Key, Link, Code } from 'lucide-react';

const GoogleSheetsDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Sheets Database Integration</h1>
          <p className="text-gray-600">
            Live demonstration of Google Sheets as a database for crime data management
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Key className="h-5 w-5 mr-2 text-blue-600" />
            Setup Instructions
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">1. Google Cloud Console Setup</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                <li>• Create a new project or select existing one</li>
                <li>• Enable Google Sheets API</li>
                <li>• Create credentials (API Key)</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">2. Environment Configuration</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Copy .env.example to .env</li>
                <li>• Add your Google Sheets API key</li>
                <li>• Make sure the Google Sheet is publicly readable</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">3. Google Sheet Configuration</h3>
              <div className="text-purple-800 text-sm space-y-1">
                <p>Current Sheet: <a href="https://docs.google.com/spreadsheets/d/1bYwyyGFR-Dkfo7yE8t0ftw_xXblJosKEP3ud3k0IPAc/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline font-mono">1bYwyyGFR-Dkfo7yE8t0ftw_xXblJosKEP3ud3k0IPAc</a></p>
                <p>Required columns: ID, Date, Time, Location, Latitude, Longitude, Crime Type, Severity, District, City, State, Description, Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Sheets Manager */}
        <GoogleSheetsManager />

        {/* Code Examples */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Code className="h-5 w-5 mr-2 text-green-600" />
            Code Examples
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Reading Data</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`import { googleSheetsService } from './services/googleSheetsService';

// Read all records from Google Sheets
const records = await googleSheetsService.readAllData();
console.log(\`Loaded \${records.length} records\`);`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Adding Records</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`const newRecord = {
  id: 'crime-001',
  date: '2024-01-15',
  time: '14:30:00',
  location: 'MG Road, Bangalore',
  latitude: 12.9716,
  longitude: 77.5946,
  crime_type: 'Theft',
  severity: 'Medium',
  district: 'Central Bangalore',
  city: 'Bangalore',
  state: 'Karnataka',
  description: 'Mobile phone theft',
  status: 'Open'
};

await googleSheetsService.addRecords([newRecord]);`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Updating Records</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`// Update specific fields of a record
await googleSheetsService.updateRecord('crime-001', {
  status: 'Closed',
  description: 'Case resolved - suspect apprehended'
});`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Deleting Records</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`// Delete a record by ID
await googleSheetsService.deleteRecord('crime-001');`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-purple-600" />
            Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Real-time Sync</h3>
              <p className="text-gray-600 text-sm">
                All changes are immediately reflected in the Google Sheet and vice versa
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">CRUD Operations</h3>
              <p className="text-gray-600 text-sm">
                Complete Create, Read, Update, Delete functionality
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Type Safety</h3>
              <p className="text-gray-600 text-sm">
                Full TypeScript support with proper type definitions
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Error Handling</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive error handling and user feedback
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Bulk Operations</h3>
              <p className="text-gray-600 text-sm">
                Support for batch operations and data migration
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Authentication</h3>
              <p className="text-gray-600 text-sm">
                Secure API key-based authentication with Google
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsDemo;