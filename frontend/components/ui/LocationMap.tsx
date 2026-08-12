'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix iconos Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  latitude: number;
  longitude: number;
}

interface NominatimPlace {
  lat: string;
  lon: string;
  display_name: string;
}

interface LocationMapProps {
  location: Location;                    // Solo una ubicación
  initialZoom?: number;
  isEditing?: boolean;
  onLocationSelect?: (lat: number, lon: number) => void;
}

export default function LocationMap({ 
  location, 
  initialZoom = 16,
  isEditing,
  onLocationSelect
}: LocationMapProps) {
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    location.latitude, 
    location.longitude
  ]);

  // Buscador + Autocompletado
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimPlace[]>([]);

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

  const selectSearchResult = (place: NominatimPlace) => {
    const newPos: [number, number] = [parseFloat(place.lat), parseFloat(place.lon)];
    setMapCenter(newPos);
    setQuery(place.display_name);
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col w-full mx-auto p-6">
      {/* Header compactado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Ubicación en Mapa</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">
              Lat: {mapCenter[0]} | Lng: {mapCenter[1]}
            </span>
            {isEditing && onLocationSelect && (
              <button
                type="button"
                onClick={() => onLocationSelect(mapCenter[0], mapCenter[1])}
                className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
              >
                Aplicar ubicación
              </button>
            )}
          </div>
        </div>

        {/* Buscador de direcciones */}
        <div className="relative w-full sm:w-87.5 md:w-112.5">
          <input
            type="text"
            value={query}
            placeholder="Buscar otra dirección en Ecuador..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => {
              setQuery(e.target.value);
              searchAddress(e.target.value);
            }}
          />

          {searchResults.length > 0 && (
            <ul className="absolute z-2000 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mt-1 shadow-lg max-h-60 overflow-auto">
              {searchResults.map((place, i) => (
                <li
                  key={i}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-none text-sm"
                  onClick={() => selectSearchResult(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mapa */}
      <div className="border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xl">
        <MapContainer 
          center={mapCenter} 
          zoom={initialZoom} 
          style={{ height: '620px', width: '100%' }}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcador de la ubicación seleccionada */}
          <Marker position={mapCenter}>
            <Popup>
              <strong>Ubicación seleccionada</strong><br />
              Lat: {mapCenter[0]}<br />
              Lng: {mapCenter[1]}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

    </div>
  );
}