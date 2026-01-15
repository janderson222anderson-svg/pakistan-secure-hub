# 🔧 Route Alternatives Fix

## Issue
Route alternatives were not displaying in the UI.

## Root Causes Identified

### 1. Dependency Array Issue
The `calculateRoute` function in `useRouting.ts` was not properly included in the useEffect dependency array, causing stale closures.

### 2. Layer Removal Error
When switching routes, the code tried to remove layers that might not exist, causing errors.

### 3. Display Condition Too Strict
The UI only showed alternatives when `alternatives.length > 1`, but it should show even with 1 route for consistency.

## Fixes Applied

### 1. Fixed useRouting Hook
**File:** `src/components/map/hooks/useRouting.ts`

**Changes:**
- Moved `calculateRoute` inside useEffect to avoid stale closures
- Made `drawRoute` a useCallback to stabilize reference
- Made `handleSelectAlternative` a useCallback
- Made `clearRoute` a useCallback
- Added proper dependency arrays
- Added layer existence checks before removal

```typescript
// Before
const drawRoute = (geometry: GeoJSON.LineString) => {
  if (map.getSource("route")) {
    map.removeLayer("route-line"); // Could fail if layer doesn't exist
  }
}

// After
const drawRoute = useCallback((geometry: GeoJSON.LineString) => {
  if (map.getSource("route")) {
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getLayer("route-line-outline")) map.removeLayer("route-line-outline");
  }
}, [map]);
```

### 2. Added Debug Logging
**File:** `src/components/map/hooks/useRouteAlternatives.ts`

**Changes:**
- Added console.log for API URL
- Added console.log for OSRM response
- Added console.log for number of routes found
- Added console.log for processed routes
- Added error logging for no routes case

This helps debug when OSRM doesn't return alternatives.

### 3. Updated Display Logic
**File:** `src/components/map/RoutingPanel.tsx`

**Changes:**
- Changed condition from `alternatives.length > 1` to `alternatives.length > 0`
- Added debug log to see alternatives array
- Now shows alternatives UI even with single route

**File:** `src/components/map/RouteAlternatives.tsx`

**Changes:**
- Only show "X routes available" header when there are multiple routes
- Single route still displays in the UI for consistency

## How to Test

### 1. Open Browser Console
Press F12 to open developer tools and go to Console tab.

### 2. Calculate a Route
1. Click "Route" button
2. Select start point (A)
3. Select end point (B)
4. Wait for calculation

### 3. Check Console Logs
You should see:
```
Fetching route alternatives from: https://router.project-osrm.org/route/v1/...
OSRM Response: {code: "Ok", routes: Array(1-3), waypoints: Array(2)}
Found X route(s)
Processed routes: [{...}, {...}, ...]
RoutingPanel - alternatives: X [{...}, ...]
```

### 4. Check UI
- If OSRM returns multiple routes (usually 2-3), you'll see them listed
- Each route shows:
  - Type (Fastest/Shortest/Balanced)
  - Duration and distance
  - Savings compared to other routes
  - Color-coded badges
- Click any route to select it
- Selected route is highlighted with checkmark

## Understanding OSRM Alternatives

### When OSRM Returns Alternatives
OSRM doesn't always return alternative routes. It depends on:

1. **Route Complexity:** Simple point-to-point routes may only have one option
2. **Distance:** Longer routes are more likely to have alternatives
3. **Road Network:** Areas with multiple road options get more alternatives
4. **Algorithm:** OSRM uses heuristics to find "significantly different" routes

### Example Routes to Test

**Good for alternatives (longer routes with options):**
- Islamabad to Lahore (multiple highways)
- Karachi to Hyderabad (coastal vs inland)
- Peshawar to Islamabad (different mountain passes)

**May have single route (short/simple):**
- Within same city
- Rural areas with limited roads
- Very short distances

## Expected Behavior

### Multiple Routes Available
```
┌─────────────────────────────┐
│ 3 routes available          │
├─────────────────────────────┤
│ ⚡ Fastest          ✓       │
│ 2h 30m • 250 km             │
├─────────────────────────────┤
│ 📈 Shortest                 │
│ 2h 45m • 230 km             │
│ Save 20 km                  │
├─────────────────────────────┤
│ 🍃 Balanced                 │
│ 2h 40m • 240 km             │
│ Save 10 km                  │
└─────────────────────────────┘
```

### Single Route
```
┌─────────────────────────────┐
│ ⚡ Fastest          ✓       │
│ 2h 30m • 250 km             │
└─────────────────────────────┘
```

## Troubleshooting

### No Alternatives Showing
1. **Check Console:** Look for OSRM response
2. **Check Route:** Try longer routes with more road options
3. **Check Network:** Ensure OSRM API is accessible
4. **Check Logs:** Look for "Found X route(s)" message

### Console Shows Multiple Routes But UI Doesn't
1. Check "RoutingPanel - alternatives" log
2. Verify alternatives array is not empty
3. Check if `onSelectAlternative` prop is passed
4. Verify RouteAlternatives component is rendering

### Routes Not Switching
1. Check `handleSelectAlternative` is being called
2. Verify map is available
3. Check console for errors
4. Ensure route geometry is valid

## Performance Notes

- Route calculation happens automatically when both points are set
- Alternatives are fetched in a single API call (efficient)
- Switching between alternatives is instant (no new API call)
- Map smoothly animates to fit selected route

## Future Improvements

1. **Manual Alternative Request:** Add button to request more alternatives
2. **Route Preferences:** Let users prefer fastest/shortest/scenic
3. **Avoid Options:** Add "avoid highways" or "avoid tolls"
4. **Custom Routing:** Allow users to add waypoints for custom routes
5. **Route Comparison:** Side-by-side comparison of all alternatives

## Build Status

✅ Build successful: 4.26s
✅ No TypeScript errors
✅ All hooks properly implemented
✅ Debug logging added
✅ Ready for testing

## Files Modified

1. `src/components/map/hooks/useRouting.ts` - Fixed dependency issues
2. `src/components/map/hooks/useRouteAlternatives.ts` - Added logging
3. `src/components/map/RoutingPanel.tsx` - Updated display logic
4. `src/components/map/RouteAlternatives.tsx` - Improved UI

---

**Status:** ✅ Fixed and Ready for Testing
**Date:** January 14, 2026
