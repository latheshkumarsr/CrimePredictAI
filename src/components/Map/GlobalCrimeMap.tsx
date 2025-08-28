import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl } from 'react-leaflet';
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

interface GlobalCrimeMapProps {
  crimeData: CrimeData[];
  height?: number;
  showHeatmap?: boolean;
  filterBySeverity?: string[];
  filterByCrimeType?: string[];
}

const GlobalCrimeMap: React.FC<GlobalCrimeMapProps> = ({ 
  crimeData, 
  height = 500,
  showHeatmap = false,
  filterBySeverity = [],
  filterByCrimeType = []
}) => {
  // Global center (showing world map)
  const center: [number, number] = [20, 0]; // Center of world map
  const zoom = 2; // World view zoom level

  // Filter and process data for global view
  const processedData = useMemo(() => {
    let filtered = crimeData;

    // Apply severity filter
    if (filterBySeverity.length > 0) {
      filtered = filtered.filter(crime => filterBySeverity.includes(crime.severity));
    }

    // Apply crime type filter
    if (filterByCrimeType.length > 0) {
      filtered = filtered.filter(crime => filterByCrimeType.includes(crime.type));
    }

    // Limit data for performance (show more for global view)
    return filtered.slice(0, 1000);
  }, [crimeData, filterBySeverity, filterByCrimeType]);

  // Group crimes by region for better visualization
  const regionGroups = useMemo(() => {
    const groups: Record<string, CrimeData[]> = {};
    
    processedData.forEach(crime => {
      // Determine region based on coordinates
      const region = getRegionFromCoordinates(crime.location.lat, crime.location.lng);
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(crime);
    });

    return groups;
  }, [processedData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getCrimeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Theft': '#3b82f6',
      'Burglary': '#ef4444',
      'Assault': '#f59e0b',
      'Vandalism': '#10b981',
      'Drug-related': '#8b5cf6',
      'Vehicle Crime': '#06b6d4',
      'Robbery': '#f97316',
      'Fraud': '#84cc16'
    };
    return colors[type] || '#6b7280';
  };

  const getMarkerSize = (crimeCount: number) => {
    if (crimeCount > 50) return 12;
    if (crimeCount > 20) return 10;
    if (crimeCount > 10) return 8;
    return 6;
  };

  if (crimeData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Global Crime Map</h3>
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No crime data available for global visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Global Crime Distribution</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Showing {processedData.length.toLocaleString()} of {crimeData.length.toLocaleString()} incidents</span>
          <span>•</span>
          <span>Worldwide Coverage</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="font-semibold text-gray-700">Severity:</span>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>Critical</span>
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <span>High</span>
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span>Medium</span>
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>Low</span>
            </div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Marker Size:</span>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span>1-10</span>
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>11-20</span>
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span>21-50</span>
              <div className="w-5 h-5 rounded-full bg-blue-600"></div>
              <span>50+</span>
            </div>
          </div>
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: `${height}px`, width: '100%' }}
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Crime Incidents">
            <>
              {processedData.map((crime) => (
                <CircleMarker
                  key={crime.id}
                  center={[crime.location.lat, crime.location.lng]}
                  radius={getMarkerSize(1)}
                  fillColor={getSeverityColor(crime.severity)}
                  color="#fff"
                  weight={1}
                  opacity={0.8}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <div className="p-2 min-w-48">
                      <h4 className="font-semibold text-blue-900 mb-2">{crime.type}</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Location:</span> {crime.location.address}</p>
                        <p><span className="font-medium">District:</span> {crime.location.district}</p>
                        <p><span className="font-medium">Coordinates:</span> {crime.location.lat.toFixed(4)}, {crime.location.lng.toFixed(4)}</p>
                        <p><span className="font-medium">Severity:</span> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                            crime.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            crime.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                            crime.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {crime.severity}
                          </span>
                        </p>
                        <p><span className="font-medium">Status:</span> {crime.status}</p>
                        <p><span className="font-medium">Date:</span> {crime.timestamp.toLocaleDateString()}</p>
                        <p><span className="font-medium">Region:</span> {getRegionFromCoordinates(crime.location.lat, crime.location.lng)}</p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* Regional Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(regionGroups).map(([region, crimes]) => (
          <div key={region} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{crimes.length}</div>
            <div className="text-xs text-gray-600">{region}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to determine region from coordinates
function getRegionFromCoordinates(lat: number, lng: number): string {
  // North America
  if (lat >= 15 && lat <= 72 && lng >= -168 && lng <= -52) {
    return 'North America';
  }
  // South America
  if (lat >= -56 && lat <= 15 && lng >= -82 && lng <= -34) {
    return 'South America';
  }
  // Europe
  if (lat >= 35 && lat <= 72 && lng >= -25 && lng <= 45) {
    return 'Europe';
  }
  // Africa
  if (lat >= -35 && lat <= 38 && lng >= -18 && lng <= 52) {
    return 'Africa';
  }
  // Asia
  if (lat >= -10 && lat <= 82 && lng >= 25 && lng <= 180) {
    return 'Asia';
  }
  // Oceania
  if (lat >= -50 && lat <= -10 && lng >= 110 && lng <= 180) {
    return 'Oceania';
  }
  // Antarctica
  if (lat < -60) {
    return 'Antarctica';
  }
  
  return 'Other';
}

export default GlobalCrimeMap;