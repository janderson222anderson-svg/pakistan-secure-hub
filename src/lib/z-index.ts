// Z-Index Management System
// This file defines the z-index hierarchy for all components

export const Z_INDEX = {
  // Base map elements
  MAP_BASE: 1,
  COORDINATES: 10,
  
  // Docs button - should be low priority
  DOCS_BUTTON: 12,
  
  // Map controls and UI elements
  MAP_CONTROLS: 20,
  SEARCH_RESULTS: 25,
  LOCATION_ERROR: 25,
  
  // Navigation and floating elements
  NAVIGATION_CONTROLS: 30,
  SEARCH_BAR: 35,
  FLOATING_BUTTONS: 35,
  
  // Primary panels (routing panel)
  ROUTING_PANEL: 40,
  ROUTING_PANEL_HEADER: 45,
  
  // Secondary panels (layer, POI, measurement)
  SECONDARY_PANEL_BACKDROP: 50,
  SECONDARY_PANEL: 55,
  
  // Overlay panels (weather, elevation) - should be on top
  OVERLAY_PANEL_BACKDROP: 80,
  OVERLAY_PANEL: 85,
  
  // System overlays
  DEBUG_INFO: 90,
  TOAST: 95,
  
  // Maximum z-index for critical system elements
  MODAL: 100,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;