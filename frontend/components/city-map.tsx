'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface MapProps {
  lat: number
  lng: number
  zoom?: number
}

const Map = ({ lat, lng, zoom = 12 }: MapProps) => {
  const mapContainer = useRef(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      dragPan: false,
      scrollZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoomRotate: false,
      dragRotate: false,
      keyboard: false,
    })

    return () => map.remove()
  }, [lat, lng, zoom])

  return <div ref={mapContainer} style={{ width: '100%', height: '300px' }} />
}

export default Map
