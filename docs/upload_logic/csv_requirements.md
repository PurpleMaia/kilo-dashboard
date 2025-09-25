# CSV File Requirements

Your CSV file must follow a specific structure so the Kilo system can correctly import and store the data.

---

## Required Columns

1. **Region Name**  
   - Describes the general region where the data was collected.  
   - **Example:** `NOH` (Nation of Hawai‘i)

2. **Location Name**  
   - Specifies the exact location within the region.  
   - **Example:** `Top Bed`

3. **Sensor ID**  
   - Identifies the specific sensor that collected the data.  
   - **Example:** `TDS-001`

4. **Timestamp**  
   - The date and time of each measurement.  
   - Must follow the **specific naming convention** described in the next section.

---

## Header Naming Rules for Data Columns

All measurement columns (the actual data values) must follow a strict **naming convention** so the system can automatically categorize and store the metrics.

**Format:**  
- **`metric_category`** → the broad category of the measurement (e.g., `water`, `air`, `sensor`).  
- **`metric_type`** → the specific property being measured (e.g., `ph`, `temperature`, `timestamp`).  
- **`unit`** → the unit of measurement (e.g., `celsius`, `date`, `ppm`).  
  *(If the metric has no unit, you can leave this part out.)*

### Examples

| Header Name               | Meaning                                                      |
|---------------------------|--------------------------------------------------------------|
| `sensor_timestamp_date`   | Timestamp of the sensor reading, using a date as the unit. All timestamp headers will have `sensor` as the `metric_category`          |
| `water_ph`                | pH level of the water (no unit specified).                   |
| `air_temperature_celsius` | Air temperature in degrees Celsius.                          |
| `water_temperature_celsius`     | Water temperature in degrees units.                                |
