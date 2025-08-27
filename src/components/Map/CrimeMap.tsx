import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { MapPin } from 'lucide-react';
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
}

const CrimeMap: React.FC<CrimeMapProps> = ({ crimeData, height = 400 }) => {
  const center: [number, number] = [40.7128, -74.0060]; // NYC coordinates

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Crime Hotspot Map</h3>
      <MapContainer center={center} zoom={12} style={{ height: `${height}px`, width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {crimeData.slice(0, 100).map((crime) => (
          <CircleMarker
            key={crime.id}
            center={[crime.location.lat, crime.location.lng]}
            radius={6}
            fillColor={getSeverityColor(crime.severity)}
            color="#fff"
            weight={2}
            opacity={1}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-blue-900">{crime.type}</h4>
                <p className="text-sm text-gray-600">{crime.location.address}</p>
                <p className="text-sm text-gray-600">Severity: {crime.severity}</p>
                <p className="text-sm text-gray-600">Status: {crime.status}</p>
                <p className="text-sm text-gray-600">
                  Date: {crime.timestamp.toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CrimeMap;