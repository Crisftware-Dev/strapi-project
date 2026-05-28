import { useState } from "react";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("../ui/LocationMap"), { ssr: false });

interface RenderMapProps {
  latitude?: string | number;
  longitude?: string | number;
  isEditing?: boolean;
  onLocationSelect?: (lat: number, lon: number) => void;
}

export default function RenderMap({ latitude, longitude, isEditing, onLocationSelect }: RenderMapProps) {
  const [showMap, setShowMap] = useState(false);

  const lat = Number(latitude);
  const lon = Number(longitude);
  const hasCoords = !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0;

  return (
    <>
      {/* Botón para ver la ubicación en el mapa */}
      <button
        type="button"
        disabled={!hasCoords}
        onClick={() => setShowMap(true)}
        className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
          bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
        </svg>
        Ver en mapa
      </button>

      {/* Modal de vista previa del mapa */}
      {showMap && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de ubicación GPS"
          className="fixed inset-0 z-5000 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMap(false);
          }}
          style={{
            background: "rgba(15, 15, 35, 0.75)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="relative w-[90vw] max-h-[90vh] overflow-auto rounded-2xl shadow-2xl bg-white dark:bg-gray-900 ring-1 ring-indigo-200 dark:ring-indigo-800">
            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-600 dark:text-indigo-400">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
                </span>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Vista previa de ubicación GPS</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Cerrar mapa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            {/* Mapa */}
            <LocationMap 
              location={{ latitude: lat, longitude: lon }} 
              isEditing={isEditing}
              onLocationSelect={(newLat, newLon) => {
                if (onLocationSelect) onLocationSelect(newLat, newLon);
                setShowMap(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
