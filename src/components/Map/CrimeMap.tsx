import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { MapPin, Filter, Eye, EyeOff } from 'lucide-react';
import { CrimeData } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CrimeMapProps {
  crimeData: CrimeData[];
  height?: number;
  showAllPoints?: boolean;
}

const CrimeMap: React.FC<CrimeMapProps> = ({ crimeData, height = 400, showAllPoints = true }) => {
  const [visibleCrimeTypes, setVisibleCrimeTypes] = React.useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = React.useState(false);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([20.5937, 78.9629]); // India center
  const [zoomLevel, setZoomLevel] = React.useState(5);

  // Get unique crime types from data
  const crimeTypes = React.useMemo(() => {
    return Array.from(new Set(crimeData.map(crime => crime.type)));
  }, [crimeData]);

  // Initialize visible crime types
  React.useEffect(() => {
    if (crimeTypes.length > 0 && visibleCrimeTypes.size === 0) {
      setVisibleCrimeTypes(new Set(crimeTypes));
    }
  }, [crimeTypes, visibleCrimeTypes.size]);

  // Determine map center based on data
  React.useEffect(() => {
    if (crimeData.length > 0) {
      const hasIndianData = crimeData.some(crime => 
        crime.location.lat > 6 && crime.location.lat < 37 && 
        crime.location.lng > 68 && crime.location.lng < 98
      );
      
      if (hasIndianData) {
        setMapCenter([20.5937, 78.9629]); // India center
        setZoomLevel(5);
      } else {
        setMapCenter([40.7128, -74.0060]); // NYC center
        setZoomLevel(10);
      }
    }
  }, [crimeData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getCrimeTypeColor = (crimeType: string) => {
    const colors = [
      '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    const index = crimeTypes.indexOf(crimeType) % colors.length;
    return colors[index];
  };

  const toggleCrimeType = (crimeType: string) => {
    const newVisibleTypes = new Set(visibleCrimeTypes);
    if (newVisibleTypes.has(crimeType)) {
      newVisibleTypes.delete(crimeType);
    } else {
      newVisibleTypes.add(crimeType);
    }
    setVisibleCrimeTypes(newVisibleTypes);
  };

  const toggleAllCrimeTypes = () => {
    if (visibleCrimeTypes.size === crimeTypes.length) {
      setVisibleCrimeTypes(new Set());
    } else {
      setVisibleCrimeTypes(new Set(crimeTypes));
    }
  };

  // Filter data based on visible crime types and limit if needed
  const filteredData = React.useMemo(() => {
    const filtered = crimeData.filter(crime => visibleCrimeTypes.has(crime.type));
    return showAllPoints ? filtered : filtered.slice(0, 500); // Limit to 500 for performance
  }, [crimeData, visibleCrimeTypes, showAllPoints]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Crime Hotspot Map ({filteredData.length.toLocaleString()} points)
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Crime Type Filters */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Crime Types</h4>
            <button
              onClick={toggleAllCrimeTypes}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              {visibleCrimeTypes.size === crimeTypes.length ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{visibleCrimeTypes.size === crimeTypes.length ? 'Hide All' : 'Show All'}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {crimeTypes.map((crimeType) => (
              <label key={crimeType} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleCrimeTypes.has(crimeType)}
                  onChange={() => toggleCrimeType(crimeType)}
                  className="rounded"
                />
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getCrimeTypeColor(crimeType) }}
                ></div>
                <span className="text-sm text-gray-700">{crimeType}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <MapContainer 
        center={mapCenter} 
        zoom={zoomLevel} 
        style={{ height: `${height}px`, width: '100%' }}
        key={`${mapCenter[0]}-${mapCenter[1]}-${zoomLevel}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredData.map((crime) => (
          <CircleMarker
            key={crime.id}
            center={[crime.location.lat, crime.location.lng]}
            radius={4}
            fillColor={getCrimeTypeColor(crime.type)}
            color="#fff"
            weight={1}
            opacity={1}
            fillOpacity={0.7}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-blue-900">{crime.type}</h4>
                <p className="text-sm text-gray-600">{crime.location.address}</p>
                <p className="text-sm text-gray-600">District: {crime.location.district}</p>
                <p className="text-sm text-gray-600">Severity: {crime.severity}</p>
                <p className="text-sm text-gray-600">Status: {crime.status}</p>
                <p className="text-sm text-gray-600">
                  Date: {crime.timestamp.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">{crime.description}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* Map Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-800">{crimeData.length.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Records</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-800">{filteredData.length.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Visible Points</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-800">{crimeTypes.length}</div>
          <div className="text-xs text-gray-600">Crime Types</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-800">{visibleCrimeTypes.size}</div>
          <div className="text-xs text-gray-600">Active Filters</div>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;