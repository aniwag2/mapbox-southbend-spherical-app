import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

const INITIAL_CENTER: [number, number] = [-86.2520, 41.6764]
const INITIAL_ZOOM = 12.86

type MarkerData = { lng: number; lat: number; description: string };

function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markerRefs = useRef<mapboxgl.Marker[]>([]);

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [canAddPins, setCanAddPins] = useState(false);
  const [canDeletePins, setCanDeletePins] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('my_map_markers');
    if (stored) setMarkers(JSON.parse(stored));
  }, []);

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  // Initialize map only once
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    if (!mapContainerRef.current) return

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/streets-v11',
    });

    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current!.getCenter()
      const mapZoom = mapRef.current!.getZoom()
      setCenter([mapCenter.lng, mapCenter.lat])
      setZoom(mapZoom)
    })

    return () => {
      mapRef.current?.remove()
    }
  }, []);

  // Handle add pins mode: map click handler
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      const description = window.prompt('Enter a description for this place:');
      if (description) {
        const newMarker = { lng, lat, description };
        setMarkers((prev) => {
          const updated = [...prev, newMarker];
          localStorage.setItem('my_map_markers', JSON.stringify(updated));
          return updated;
        });
      }
    };

    if (canAddPins) {
      map.on('click', handleMapClick);
    } else {
      map.off('click', handleMapClick);
    }

    // Clean up handler when toggling or on unmount
    return () => {
      map.off('click', handleMapClick);
    };
  }, [canAddPins]);

  // Render markers and handle delete mode
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove previous markers
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];

    markers.forEach((marker, idx) => {
      const mapMarker = new mapboxgl.Marker()
        .setLngLat([marker.lng, marker.lat])
        .setPopup(new mapboxgl.Popup().setText(marker.description))
        .addTo(mapRef.current!);

      if (canDeletePins) {
        mapMarker.getElement().style.cursor = 'pointer';
        mapMarker.getElement().onclick = () => {
          setMarkers(prev => {
            const updated = prev.filter((_, i) => i !== idx);
            localStorage.setItem('my_map_markers', JSON.stringify(updated));
            return updated;
          });
        };
      } else {
        mapMarker.getElement().onclick = null;
        mapMarker.getElement().style.cursor = '';
      }

      markerRefs.current.push(mapMarker);
    });
  }, [markers, canDeletePins]);

  // Reset map view
  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      bearing: 0,
      pitch: 0,
      speed: 1.2,
      curve: 1.4
    })
  }

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <button className='reset-button' onClick={handleButtonClick}>
        Reset
      </button>
      <button
        className='toggle-pins'
        onClick={() => setCanAddPins(v => !v)}
        disabled={canDeletePins}
        style={{
          background: canAddPins ? '#1976d2' : undefined,
          color: canAddPins ? 'white' : undefined,
        }}
      >
        {canAddPins ? 'Stop Adding Pins' : 'Add Pins'}
      </button>
      <button
        className='toggle-delete-pins'
        onClick={() => setCanDeletePins(v => !v)}
        disabled={canAddPins}
        style={{
          background: canDeletePins ? 'tomato' : undefined,
          color: canDeletePins ? 'white' : undefined,
        }}
      >
        {canDeletePins ? 'Stop Deleting Pins' : 'Delete Pins'}
      </button>
      <div id='map-container' ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  )
}

export default App
