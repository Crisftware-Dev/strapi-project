'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix iconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationMapProps {
  location: Location;                    // Solo una ubicación
  initialZoom?: number;
}

export default function LocationMap({ 
  location, 
  initialZoom = 16 
}: LocationMapProps) {
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    location.latitude, 
    location.longitude
  ]);

  // Buscador + Autocompletado
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Buscar direcciones con Nominatim
  const searchAddress = async (text: string) => {
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=ec&limit=6`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  const selectSearchResult = (place: any) => {
    const newPos: [number, number] = [parseFloat(place.lat), parseFloat(place.lon)];
    setMapCenter(newPos);
    setQuery(place.display_name);
    setSearchResults([]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Ubicación en Mapa</h2>

      {/* Buscador de direcciones */}
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          placeholder="Buscar otra dirección en Ecuador..."
          className="w-full p-4 border border-gray-300 rounded-2xl text-lg focus:outline-none focus:border-blue-500"
          onChange={(e) => {
            setQuery(e.target.value);
            searchAddress(e.target.value);
          }}
        />

        {searchResults.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-2xl mt-2 shadow-xl max-h-80 overflow-auto">
            {searchResults.map((place, i) => (
              <li
                key={i}
                className="p-4 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                onClick={() => selectSearchResult(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa */}
      <div className="border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xl">
        <MapContainer 
          center={mapCenter} 
          zoom={initialZoom} 
          style={{ height: '620px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcador de la ubicación pasada por props */}
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              <strong>Ubicación principal</strong><br />
              Lat: {location.latitude}<br />
              Lng: {location.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Lat: {location.latitude} | Lng: {location.longitude}
      </div>
    </div>
  );
}