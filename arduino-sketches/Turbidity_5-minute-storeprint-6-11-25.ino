#include <EEPROM.h>  // Include EEPROM library for reading/writing non-volatile memory

// --- Sensor and Data Logging Configuration ---
int Turbidity_Sensor_Pin = A0;          // Analog pin connected to the turbidity sensor
float Turbidity_Sensor_Voltage;         // Stores average voltage reading from the sensor
int samples = 600;                      // Number of analog samples to average per reading (smoothing)
float ntu;                              // Calculated turbidity in NTU
unsigned long secondsElapsed = 0;       // Time since session start (in seconds)
int eepromAddress = 0;                  // Current EEPROM write position

// --- Sampling Interval ---
// >>> TO CHANGE SAMPLE RATE, MODIFY THIS VALUE:
int sampleIntervalSeconds = 300;          // <-- Change this to adjust sample frequency (e.g., 10 for every 10s)
unsigned long sampleIntervalMs = sampleIntervalSeconds * 1000UL; // Interval in milliseconds

// --- Timing and Session Control ---
unsigned long previousMillis = 0;       // Last time a sample was taken
bool sessionStarted = false;            // Flag to indicate if new session has started
bool loggingEnabled = false;            // Flag to control logging
unsigned long sessionStartTime = 0;     // Time when setup() finished (used to delay new session start)

void setup() {
  Serial.begin(9600);                   // Start serial communication
  pinMode(Turbidity_Sensor_Pin, INPUT); // Set sensor pin as input
  delay(1000);                          // Short delay for stabilization

  Serial.println("Reading stored NTU values from EEPROM...");

  // --- EEPROM Read Phase ---
  unsigned long storedTime;
  float storedNTU;
  int readAddress = 0;

  // Loop through EEPROM to read stored time and NTU values
  while (readAddress + sizeof(unsigned long) + sizeof(float) <= EEPROM.length()) {
    EEPROM.get(readAddress, storedTime);
    EEPROM.get(readAddress + sizeof(unsigned long), storedNTU);

    // Stop reading if data is invalid or empty
    if (isnan(storedNTU) || storedNTU == -1.0f || storedNTU == 0.0f ||
        storedTime == 0xFFFFFFFF || storedTime == 0) {
      break;
    }

    // Print previously stored data
    Serial.print("Time: ");
    Serial.print(storedTime);
    Serial.print("s | NTU: ");
    Serial.println(storedNTU);

    // Advance to next record
    readAddress += sizeof(unsigned long) + sizeof(float);
  }

  Serial.println("\nWaiting 10 seconds before starting new session...");
  sessionStartTime = millis();  // Start 10-second delay
}

void loop() {
  unsigned long currentMillis = millis();

  // --- Wait Before Starting New Session ---
  if (!sessionStarted && currentMillis - sessionStartTime >= 10000) {
    Serial.println("EEPROM cleared. Starting new data logging session...");

    // Clear EEPROM memory to prepare for new session
    for (int i = 0; i < EEPROM.length(); i++) {
      EEPROM.write(i, 0xFF);
    }

    // Reset counters
    eepromAddress = 0;
    secondsElapsed = 0;
    previousMillis = currentMillis;

    sessionStarted = true;
    loggingEnabled = true;
  }

  // --- Main Logging Routine ---
  if (sessionStarted && loggingEnabled && currentMillis - previousMillis >= sampleIntervalMs) {
    previousMillis = currentMillis;

    // --- EEPROM Space Check ---
    if (eepromAddress + sizeof(unsigned long) + sizeof(float) > EEPROM.length()) {
      Serial.println("EEPROM full. Logging stopped.");
      loggingEnabled = false; // Stop logging
      return;
    }

    // Update time elapsed
    secondsElapsed += sampleIntervalSeconds;

    // --- Sensor Reading ---
    Turbidity_Sensor_Voltage = 0;
    for (int i = 0; i < samples; i++) {
      Turbidity_Sensor_Voltage += ((float)analogRead(Turbidity_Sensor_Pin) / 1023) * 5;
    }
    Turbidity_Sensor_Voltage /= samples;
    Turbidity_Sensor_Voltage = round_to_dp(Turbidity_Sensor_Voltage, 2); // Round to 2 decimal places

    // --- Voltage to NTU Conversion ---
    if (Turbidity_Sensor_Voltage < 2.5) {
      ntu = 3000;  // Cap NTU at 3000 for low voltages (very turbid water)
    } else {
      ntu = -1120.4 * square(Turbidity_Sensor_Voltage) +
             5742.3 * Turbidity_Sensor_Voltage - 4352.9;
    }

    // --- Print Reading ---
    Serial.print("Time: ");
    Serial.print(secondsElapsed);
    Serial.print("s | Voltage: ");
    Serial.print(Turbidity_Sensor_Voltage);
    Serial.print(" V | NTU: ");
    Serial.println(ntu);

    // --- Store in EEPROM ---
    EEPROM.put(eepromAddress, secondsElapsed);
    EEPROM.put(eepromAddress + sizeof(unsigned long), ntu);
    eepromAddress += sizeof(unsigned long) + sizeof(float);  // Move to next slot
  }
}

// --- Utility Function ---
// Rounds a float to a given number of decimal places
float round_to_dp(float in_value, int decimal_place) {
  float multiplier = powf(10.0f, decimal_place);
  return roundf(in_value * multiplier) / multiplier;
}
