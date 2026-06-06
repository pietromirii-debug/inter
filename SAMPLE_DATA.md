# Sample Data for Testing

## Add Sample Stations

Use Postman or curl to add sample stations:

```bash
curl -X POST http://localhost:5000/admin/stations/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '[
    {
      "StationName": "Three Gorges Dam",
      "WaterLevel": 175.5,
      "NormalPoolLevel": 175.0,
      "FloodControlLevel": 171.0,
      "InstalledCapacity": 22500,
      "RegulationType": "Run-of-river",
      "Province": "Hubei",
      "ParentOrganization": "China Three Gorges Corporation",
      "LongitudeLatitude": "30.8355,111.0053"
    },
    {
      "StationName": "Xiaolangdi Dam",
      "WaterLevel": 275.0,
      "NormalPoolLevel": 275.0,
      "FloodControlLevel": 266.0,
      "InstalledCapacity": 1800,
      "RegulationType": "Multi-purpose",
      "Province": "Henan",
      "ParentOrganization": "Yellow River Conservancy Commission",
      "LongitudeLatitude": "34.5833,112.5000"
    },
    {
      "StationName": "Longtan Hydropower Station",
      "WaterLevel": 400.0,
      "NormalPoolLevel": 400.0,
      "FloodControlLevel": 395.0,
      "InstalledCapacity": 5700,
      "RegulationType": "Run-of-river",
      "Province": "Guangxi",
      "ParentOrganization": "China Huaneng Group",
      "LongitudeLatitude": "25.0333,107.2667"
    },
    {
      "StationName": "Ertan Hydropower Station",
      "WaterLevel": 200.0,
      "NormalPoolLevel": 200.0,
      "FloodControlLevel": 195.0,
      "InstalledCapacity": 3300,
      "RegulationType": "Run-of-river",
      "Province": "Sichuan",
      "ParentOrganization": "China Yangtze Power Company",
      "LongitudeLatitude": "26.2167,101.9667"
    },
    {
      "StationName": "Daya Bay Nuclear Power Station",
      "WaterLevel": 10.0,
      "NormalPoolLevel": 10.0,
      "FloodControlLevel": 8.0,
      "InstalledCapacity": 1968,
      "RegulationType": "Nuclear",
      "Province": "Guangdong",
      "ParentOrganization": "China Guangdong Nuclear Power Company",
      "LongitudeLatitude": "22.6347,114.5531"
    }
  ]'
```

## Add Sample Hydrological Data

```bash
curl -X POST http://localhost:5000/admin/hydrological/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '[
    {
      "StationId": 1,
      "RecordDate": "2026-06-01",
      "ReservoirWaterLevel": 174.5,
      "InboundFlow": 5000.0,
      "OutboundFlow": 4800.0,
      "WaterStorageCapacity": 39300.0
    },
    {
      "StationId": 1,
      "RecordDate": "2026-06-02",
      "ReservoirWaterLevel": 174.8,
      "InboundFlow": 5100.0,
      "OutboundFlow": 4900.0,
      "WaterStorageCapacity": 39350.0
    },
    {
      "StationId": 1,
      "RecordDate": "2026-06-03",
      "ReservoirWaterLevel": 175.2,
      "InboundFlow": 5200.0,
      "OutboundFlow": 5000.0,
      "WaterStorageCapacity": 39400.0
    },
    {
      "StationId": 1,
      "RecordDate": "2026-06-04",
      "ReservoirWaterLevel": 175.5,
      "InboundFlow": 5300.0,
      "OutboundFlow": 5100.0,
      "WaterStorageCapacity": 39450.0
    },
    {
      "StationId": 1,
      "RecordDate": "2026-06-05",
      "ReservoirWaterLevel": 175.3,
      "InboundFlow": 5150.0,
      "OutboundFlow": 5050.0,
      "WaterStorageCapacity": 39420.0
    },
    {
      "StationId": 2,
      "RecordDate": "2026-06-01",
      "ReservoirWaterLevel": 274.5,
      "InboundFlow": 3000.0,
      "OutboundFlow": 2900.0,
      "WaterStorageCapacity": 12600.0
    },
    {
      "StationId": 2,
      "RecordDate": "2026-06-02",
      "ReservoirWaterLevel": 274.8,
      "InboundFlow": 3100.0,
      "OutboundFlow": 3000.0,
      "WaterStorageCapacity": 12650.0
    },
    {
      "StationId": 2,
      "RecordDate": "2026-06-03",
      "ReservoirWaterLevel": 274.9,
      "InboundFlow": 3200.0,
      "OutboundFlow": 3100.0,
      "WaterStorageCapacity": 12700.0
    },
    {
      "StationId": 2,
      "RecordDate": "2026-06-04",
      "ReservoirWaterLevel": 275.0,
      "InboundFlow": 3250.0,
      "OutboundFlow": 3150.0,
      "WaterStorageCapacity": 12750.0
    },
    {
      "StationId": 2,
      "RecordDate": "2026-06-05",
      "ReservoirWaterLevel": 274.7,
      "InboundFlow": 3100.0,
      "OutboundFlow": 3000.0,
      "WaterStorageCapacity": 12700.0
    },
    {
      "StationId": 3,
      "RecordDate": "2026-06-01",
      "ReservoirWaterLevel": 399.5,
      "InboundFlow": 7000.0,
      "OutboundFlow": 6800.0,
      "WaterStorageCapacity": 27030.0
    },
    {
      "StationId": 3,
      "RecordDate": "2026-06-02",
      "ReservoirWaterLevel": 399.8,
      "InboundFlow": 7100.0,
      "OutboundFlow": 6900.0,
      "WaterStorageCapacity": 27080.0
    },
    {
      "StationId": 3,
      "RecordDate": "2026-06-03",
      "ReservoirWaterLevel": 400.0,
      "InboundFlow": 7200.0,
      "OutboundFlow": 7000.0,
      "WaterStorageCapacity": 27130.0
    },
    {
      "StationId": 3,
      "RecordDate": "2026-06-04",
      "ReservoirWaterLevel": 399.9,
      "InboundFlow": 7150.0,
      "OutboundFlow": 6950.0,
      "WaterStorageCapacity": 27100.0
    },
    {
      "StationId": 3,
      "RecordDate": "2026-06-05",
      "ReservoirWaterLevel": 399.7,
      "InboundFlow": 7050.0,
      "OutboundFlow": 6850.0,
      "WaterStorageCapacity": 27080.0
    }
  ]'
```

## How to Get Your Admin Token

1. First, register as a user (if you haven't already):
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "user_type": "Admin"
  }'
```

2. Then login to get the token:
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

3. Copy the `access_token` from the response and use it in the Authorization header above.

## Using Postman

1. **Create new request** → Choose **POST**
2. **URL**: `http://localhost:5000/admin/stations/bulk`
3. **Headers tab**:
   - Key: `Content-Type`, Value: `application/json`
   - Key: `Authorization`, Value: `Bearer YOUR_TOKEN_HERE`
4. **Body tab** → Select **raw** → Select **JSON** from dropdown
5. Paste the sample data JSON
6. Click **Send**

## Verify Data

Check if data was added:
```bash
curl -X GET http://localhost:5000/stations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

You should see the stations returned.

---

After adding this data, refresh your browser and the stations should appear on the map and in the prediction dropdown!
