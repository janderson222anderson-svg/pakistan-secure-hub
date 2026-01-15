// Format distance for display
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

// Format duration for display
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

// Format area for display
export const formatArea = (sqMeters: number): string => {
  if (sqMeters >= 1000000) {
    return `${(sqMeters / 1000000).toFixed(2)} km²`;
  } else if (sqMeters >= 10000) {
    return `${(sqMeters / 10000).toFixed(2)} ha`;
  }
  return `${sqMeters.toFixed(0)} m²`;
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Calculate polygon area using Shoelace formula (in square meters)
export const calculatePolygonArea = (points: [number, number][]): number => {
  if (points.length < 3) return 0;
  
  const centerLat = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  const latToMeters = 111320;
  const lngToMeters = 111320 * Math.cos((centerLat * Math.PI) / 180);
  
  const metersPoints = points.map(([lng, lat]) => [
    lng * lngToMeters,
    lat * latToMeters
  ]);
  
  let area = 0;
  for (let i = 0; i < metersPoints.length; i++) {
    const j = (i + 1) % metersPoints.length;
    area += metersPoints[i][0] * metersPoints[j][1];
    area -= metersPoints[j][0] * metersPoints[i][1];
  }
  
  return Math.abs(area) / 2;
};

// Calculate total distance of a line (in meters)
export const calculateLineDistance = (points: [number, number][]): number => {
  if (points.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += calculateDistance(
      points[i][1], points[i][0],
      points[i + 1][1], points[i + 1][0]
    );
  }
  return totalDistance;
};

// Format maneuver to readable instruction
export const formatManeuver = (type?: string, modifier?: string, name?: string): string => {
  const roadName = name ? ` onto ${name}` : '';
  
  switch (type) {
    case 'depart':
      return `Start${roadName}`;
    case 'arrive':
      return 'You have arrived at your destination';
    case 'turn':
      return `Turn ${modifier || 'slightly'}${roadName}`;
    case 'continue':
    case 'new name':
      return `Continue${roadName}`;
    case 'merge':
      return `Merge ${modifier || ''}${roadName}`;
    case 'on ramp':
      return `Take the ramp ${modifier || ''}${roadName}`;
    case 'off ramp':
      return `Take the exit${roadName}`;
    case 'fork':
      return `Keep ${modifier || 'straight'}${roadName}`;
    case 'end of road':
      return `Turn ${modifier || 'left'}${roadName}`;
    case 'roundabout':
    case 'rotary':
      return `Enter the roundabout${roadName}`;
    default:
      return `Continue${roadName}`;
  }
};
