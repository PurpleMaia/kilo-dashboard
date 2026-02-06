# USGS Water Data API Guide

## Overview
This module retrieves water quality data from USGS Survey Stations in Hawaii.

**API Endpoint:** https://waterservices.usgs.gov/nwis/iv/

---

## Common Parameter Codes
| Code | Description |
|------|-------------|
| `00060` | Discharge (Streamflow), cubic feet per second |
| `00065` | Gage Height, feet |
| `00010` | Water Temperature |

---

## Finding a Station by Location

### Step 1: Get Coordinates for Your Area
Use the geocode endpoint:
```
GET /api/data/public/geocode?area=YourLocation
```

Example response:
```json
{
  "latitude": 19.734112,
  "longitude": -155.086823,
  "bounds": {
    "east": -155.076823,
    "south": 19.724112,
    "north": 19.744112,
    "west": -155.096823
  }
}
```

### Step 2: Generate Bounding Box Coordinates
Add/subtract `0.01` to create the search box:

| Direction | Calculation |
|-----------|-------------|
| North (max latitude) | lat + 0.01 |
| South (min latitude) | lat - 0.01 |
| East (max longitude) | lon + 0.01 |
| West (min longitude) | lon - 0.01 |

### Step 3: Find Stations Using USGS Station Finder
1. Go to: https://waterservices.usgs.gov/test-tools/?service=site
2. Select **"latitude-longitude-box"** as the major filter
3. Enter your bounding box coordinates:
   - `nlat`: North latitude (max)
   - `slat`: South latitude (min)
   - `wlong`: West longitude (min)
   - `elong`: East longitude (max)
4. Check **"Water Quality Samples"** under data types
5. Click the link to run the query

### Step 4: Get Site ID from Results
The URL will show you a curl output with an rdb format showing a list of sites, copy the site ID in the second column.

---

## Example Station
**Waimanalo Stream (16249000):**
- Gage height, feet
- Discharge, cubic feet per second
- Turbidity, water, unfiltered

Example API call:
```
https://waterservices.usgs.gov/nwis/iv/?sites=16249000&agencyCd=USGS&parameterCd=00060,00065&format=json&period=P1D
```

---

## Deprecation Notice (2/6/2026)
The `waterservices.usgs.gov` API will be deprecated in 2027. The new endpoint (`api.waterdata.usgs.gov`) is being phased in but currently doesn't support Hawaii stations.

---

## Current Implementation
This module retrieves:
- Discharge (Streamflow) - `00060`
- Gage Height - `00065`

For the past day (`period=P1D`).