# Location-Based Query Examples

## Overview
The enhanced schema now supports accurate location-based recommendations using geospatial queries.

---

## 🗺️ Location Fields Added

### Restaurants Table
| Field | Type | Purpose |
|-------|------|---------|
| `latitude` | DECIMAL(10,8) | Already existed - GPS latitude |
| `longitude` | DECIMAL(11,8) | Already existed - GPS longitude |
| `delivery_radius` | DECIMAL(5,2) | How far restaurant delivers (km) |
| `neighborhoods` | TEXT[] | Area tags (seef, juffair, adliya, etc.) |
| `city` | VARCHAR(100) | City name (default: Manama) |
| `country` | VARCHAR(100) | Country (default: Bahrain) |
| `nearby_landmark` | VARCHAR(255) | Easy reference point |

---

## 📍 Location Functions

### 1. **calculate_distance()**
Calculates distance between two GPS coordinates using Haversine formula.

**Signature:**
```sql
calculate_distance(lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL) RETURNS DECIMAL
```

**Returns:** Distance in kilometers

**Example:**
```sql
-- Distance from user to restaurant
SELECT 
  name,
  calculate_distance(26.2285, 50.5860, latitude, longitude) as distance_km
FROM restaurants
WHERE latitude IS NOT NULL;
```

---

### 2. **get_nearby_restaurants()**
Returns restaurants within a specified radius, sorted by distance.

**Signature:**
```sql
get_nearby_restaurants(user_lat DECIMAL, user_lon DECIMAL, radius_km DECIMAL DEFAULT 5.0)
```

**Returns:** Table with restaurant details + distance

**Example:**
```sql
-- Find restaurants within 5km of user location
SELECT * FROM get_nearby_restaurants(26.2285, 50.5860, 5.0);

-- Find restaurants within 2km
SELECT * FROM get_nearby_restaurants(26.2285, 50.5860, 2.0);
```

---

## 🎯 AI Query Examples

### Query 1: "Show me nearby restaurants"
**User Location:** 26.2285°N, 50.5860°E (Seef, Bahrain)

```sql
-- Get all restaurants within 5km
SELECT * FROM get_nearby_restaurants(26.2285, 50.5860, 5.0);
```

**AI Response:**
```
Here are restaurants near you (within 5km):

1. **Nando's Bahrain** - 1.2 km away
   📍 Bahrain City Centre, Seef
   ⭐ 4.6 rating
   
2. **Chili's Bahrain** - 2.3 km away
   📍 Seef Mall
   ⭐ 4.3 rating
   
3. **P.F. Chang's Bahrain** - 3.1 km away
   📍 The Avenues
   ⭐ 4.4 rating
```

---

### Query 2: "I want spicy food nearby"
**Combines:** Location + Spice level

```sql
SELECT 
  r.name,
  r.address,
  calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) as distance_km,
  d.name as dish_name,
  d.spice_level,
  d.price
FROM restaurants r
JOIN dishes d ON d.restaurant_id = r.id
WHERE calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) <= 5.0
  AND d.spice_level >= 2
  AND d.is_available = TRUE
  AND r.is_active = TRUE
ORDER BY distance_km ASC, d.spice_level DESC
LIMIT 10;
```

---

### Query 3: "Date night restaurant near City Centre"
**Combines:** Location + Occasion + Landmark

```sql
SELECT 
  r.*,
  calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) as distance_km
FROM restaurants r
WHERE 'date-night' = ANY(r.suitable_for)
  AND r.ambiance && ARRAY['romantic', 'cozy']
  AND (
    r.nearby_landmark ILIKE '%City Centre%'
    OR calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) <= 3.0
  )
  AND r.is_active = TRUE
ORDER BY distance_km ASC, r.rating DESC;
```

---

### Query 4: "High protein meal within 2km"
**Combines:** Location + Nutrition

```sql
SELECT 
  r.name as restaurant,
  r.address,
  calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) as distance_km,
  d.name as dish,
  d.protein_grams,
  d.calories,
  d.price
FROM restaurants r
JOIN dishes d ON d.restaurant_id = r.id
WHERE calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) <= 2.0
  AND d.protein_grams >= 30
  AND d.is_available = TRUE
  AND r.is_active = TRUE
ORDER BY distance_km ASC, d.protein_grams DESC
LIMIT 10;
```

---

### Query 5: "Vegetarian restaurants in Seef area"
**Combines:** Location (neighborhood) + Dietary

```sql
SELECT 
  r.*,
  calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) as distance_km
FROM restaurants r
WHERE 'seef' = ANY(r.neighborhoods)
  AND 'vegetarian' = ANY(r.dietary_options)
  AND r.is_active = TRUE
ORDER BY r.rating DESC;
```

---

### Query 6: "Quick lunch nearby under 20 mins"
**Combines:** Location + Time + Meal type

```sql
SELECT 
  r.name as restaurant,
  calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) as distance_km,
  d.name as dish,
  d.preparation_time,
  d.price
FROM restaurants r
JOIN dishes d ON d.restaurant_id = r.id
WHERE calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) <= 3.0
  AND d.preparation_time <= 20
  AND 'lunch' = ANY(d.meal_types)
  AND d.is_available = TRUE
  AND r.is_active = TRUE
ORDER BY distance_km ASC, d.preparation_time ASC
LIMIT 10;
```

---

### Query 7: "Delivery available to my location"
**Checks:** If user is within restaurant's delivery radius

```sql
SELECT 
  r.name,
  r.address,
  r.delivery_fee,
  r.delivery_radius,
  calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) as distance_km
FROM restaurants r
WHERE 'delivery' = ANY(r.service_options)
  AND calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) <= r.delivery_radius
  AND r.is_active = TRUE
ORDER BY distance_km ASC;
```

---

### Query 8: "Sports bar near me for game tonight"
**Combines:** Location + Occasion + Features

```sql
SELECT 
  r.*,
  calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) as distance_km
FROM restaurants r
WHERE calculate_distance(26.2285, 50.5860, r.latitude, r.longitude) <= 5.0
  AND ('sports-watching' = ANY(r.suitable_for) OR 'live-sports' = ANY(r.features))
  AND r.is_active = TRUE
ORDER BY distance_km ASC, r.rating DESC;
```

---

## 🌍 Common Bahrain Locations

### Major Areas (for testing)
| Area | Latitude | Longitude |
|------|----------|-----------|
| Seef | 26.2285 | 50.5860 |
| Juffair | 26.2235 | 50.6060 |
| Adliya | 26.2185 | 50.5960 |
| Manama (City Centre) | 26.2361 | 50.5831 |
| Riffa | 26.1300 | 50.5550 |
| Muharraq | 26.2572 | 50.6479 |
| Budaiya | 26.1500 | 50.4833 |
| Saar | 26.1833 | 50.4833 |

---

## 📱 Integration with AI Service

### Update `ai.service.ts` to include location context:

```typescript
export const sendAIMessage = async (
  message: string,
  context: {
    userId?: string;
    userName?: string;
    location?: string;
    userLat?: number;  // Add user GPS coordinates
    userLon?: number;
  }
) => {
  const response = await fetch('http://localhost:5678/webhook/wajba-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      userId: context.userId,
      userName: context.userName,
      location: context.location,
      userLat: context.userLat,
      userLon: context.userLon,
      timestamp: new Date().toISOString(),
    }),
  });
  
  return await response.json();
};
```

### Update `AIChatScreen.tsx` to get user location:

```typescript
const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

useEffect(() => {
  // Get user's current location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude
      });
    }
  };
  getLocation();
}, []);

// When sending message
const aiResult = await sendAIMessage(userMessageText, {
  userId: user?.id,
  userName: profile?.full_name || 'Guest',
  location: 'Bahrain',
  userLat: userLocation?.lat,
  userLon: userLocation?.lon,
});
```

---

## 🎯 n8n Workflow Enhancement

### Add location-aware querying in n8n:

```javascript
// In n8n Supabase node
const userLat = $json.userLat || 26.2285; // Default to Seef
const userLon = $json.userLon || 50.5860;

// Query nearby restaurants
const query = `
  SELECT * FROM get_nearby_restaurants(${userLat}, ${userLon}, 5.0)
  WHERE cuisine_types && ARRAY['italian']
  LIMIT 5;
`;

// Or combine with other filters
const query2 = `
  SELECT 
    r.*,
    calculate_distance(${userLat}, ${userLon}, r.latitude, r.longitude) as distance_km
  FROM restaurants r
  WHERE 'date-night' = ANY(r.suitable_for)
    AND calculate_distance(${userLat}, ${userLon}, r.latitude, r.longitude) <= 5.0
  ORDER BY distance_km ASC, r.rating DESC
  LIMIT 5;
`;
```

---

## ✅ Benefits

✅ **Accurate proximity** - Real GPS distance calculation
✅ **Delivery radius checking** - Know if delivery is available
✅ **Neighborhood filtering** - "Show me restaurants in Seef"
✅ **Landmark-based search** - "Near City Centre Mall"
✅ **Combined queries** - Location + dietary + occasion + budget
✅ **Sorted by distance** - Closest restaurants first
✅ **Performance optimized** - Geospatial indexes for fast queries

---

## 🚀 Result

**Users can now ask:**
- "Show me nearby restaurants" ✅
- "I want spicy food within 2km" ✅
- "Date night restaurant near City Centre" ✅
- "High protein meal nearby" ✅
- "Vegetarian options in Seef" ✅
- "Quick lunch within walking distance" ✅
- "Can they deliver to my location?" ✅
- "Sports bar near me" ✅

**All with accurate distance-based results! 📍🎯**
