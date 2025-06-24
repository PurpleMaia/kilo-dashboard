#include <EEPROM.h>
#include "DFRobot_RainfallSensor.h"

//#define MODE_UART
#ifdef MODE_UART
  #include "SoftwareSerial.h"
  SoftwareSerial mySerial(10, 11);
  DFRobot_RainfallSensor_UART Sensor(&mySerial);
#else
  DFRobot_RainfallSensor_I2C Sensor(&Wire);
#endif

#define EEPROM_SIZE 1024
#define SAMPLE_SIZE 4  // 2 bytes for count, 2 bytes for rainfall (scaled)
#define MAX_SAMPLES (EEPROM_SIZE / SAMPLE_SIZE)

int eepromAddress = 0;
unsigned int sampleCount = 0;
bool recordingActive = true;

// === Sample interval configuration ===
// Set sample interval here in milliseconds:
// e.g. 15 min = 15 * 60 * 1000 = 900000 ms
const unsigned long SAMPLE_INTERVAL = 15UL * 60UL * 1000UL; // 15 minutes
// ====================================

unsigned long lastSampleTime = 0;

void printEEPROMData() {
  Serial.println("Stored EEPROM Data:");
  for (int addr = 0; addr < EEPROM_SIZE; addr += SAMPLE_SIZE) {
    unsigned int count = EEPROM.read(addr) << 8 | EEPROM.read(addr + 1);
    unsigned int rainfallInt = EEPROM.read(addr + 2) << 8 | EEPROM.read(addr + 3);
    float rainfallMM = rainfallInt / 100.0;

    Serial.print("Sample ");
    Serial.print(count);
    Serial.print(" - Rainfall: ");
    Serial.print(rainfallMM);
    Serial.println(" mm");
  }
}

void clearEEPROM() {
  Serial.println("Clearing EEPROM...");
  for (int i = 0; i < EEPROM_SIZE; i++) {
    EEPROM.write(i, 0);
  }
  Serial.println("EEPROM Cleared.");
}

void recordSample() {
  float rainfallMM = Sensor.getRainfall(1);
  unsigned int scaledRainfall = (unsigned int)(rainfallMM * 100.0);

  if (eepromAddress + SAMPLE_SIZE <= EEPROM_SIZE) {
    EEPROM.write(eepromAddress, (sampleCount >> 8) & 0xFF);
    EEPROM.write(eepromAddress + 1, sampleCount & 0xFF);

    EEPROM.write(eepromAddress + 2, (scaledRainfall >> 8) & 0xFF);
    EEPROM.write(eepromAddress + 3, scaledRainfall & 0xFF);

    Serial.print("Logged Sample ");
    Serial.print(sampleCount);
    Serial.print(" - Rainfall: ");
    Serial.print(rainfallMM, 2);
    Serial.println(" mm");

    sampleCount++;
    eepromAddress += SAMPLE_SIZE;
    lastSampleTime = millis(); // Reset timer after sample
  }

  if (eepromAddress + SAMPLE_SIZE > EEPROM_SIZE) {
    Serial.println("EEPROM is full. Stopping data logging.");
    recordingActive = false;
  }
}

void setup(void) {
#ifdef MODE_UART
  mySerial.begin(9600);
#endif
  Serial.begin(9600);
  delay(1000);

  // Initialize sensor
  while (!Sensor.begin()) {
    Serial.println("Sensor init err!!!");
    delay(1000);
  }

  Serial.print("vid:\t");
  Serial.println(Sensor.vid, HEX);
  Serial.print("pid:\t");
  Serial.println(Sensor.pid, HEX);
  Serial.print("Version:\t");
  Serial.println(Sensor.getFirmwareVersion());

  // Step 1: Print EEPROM content
  printEEPROMData();

  // Step 2: Wait for 20 seconds
  Serial.println("Waiting 20 seconds before clearing EEPROM...");
  delay(20000);

  // Step 3: Clear EEPROM
  clearEEPROM();

  // Ready to begin new session
  eepromAddress = 0;
  sampleCount = 0;
  recordingActive = true;

  Serial.println("Starting new recording session...");

  // === Record first sample immediately ===
  recordSample();
}

void loop() {
  if (!recordingActive) {
    Serial.println("EEPROM full. Stopped sampling.");
    delay(5000);
    return;
  }

  unsigned long currentTime = millis();

  if (currentTime - lastSampleTime >= SAMPLE_INTERVAL) {
    recordSample();
  }

  // Idle until next sample time
}
