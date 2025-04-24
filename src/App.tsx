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

  useEffect(() => {
    const stored = localStorage.getItem('my_map_markers');
    if (stored) setMarkers(JSON.parse(stored));
  }, []);

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

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

    // Add click handler
    mapRef.current.on('click', (e) => {
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
    });

    return () => {
      mapRef.current?.remove()
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Remove previous markers
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];

    // Add current markers
    markers.forEach(marker => {
      const mapMarker = new mapboxgl.Marker()
        .setLngLat([marker.lng, marker.lat])
        .setPopup(new mapboxgl.Popup().setText(marker.description))
        .addTo(mapRef.current!);
      markerRefs.current.push(mapMarker);
    });
  }, [markers]);

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
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
      <button className='toggle-pins' onClick={}>
        Add Pins
      </button>
      <div id='map-container' ref={mapContainerRef} />
    </>
  )
}

export default App
