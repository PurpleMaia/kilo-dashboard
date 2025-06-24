#include <OneWire.h>
#include <EEPROM.h>

int DS18S20_Pin = 2;
OneWire ds(DS18S20_Pin);

// 1 hour = 3600000 ms
const unsigned long interval = 3600000;
unsigned long previousMillis = 0;

int eepromAddress = 0;
bool eepromFull = false;
unsigned long timestampHours = 1;

void setup() {
  Serial.begin(9600);
  delay(1000);

  Serial.println("Previous EEPROM Data:");
  printEEPROMAsJson();

  Serial.println("Clearing Previous Data in 10 seconds");
  delay(10000);

  clearEEPROM();

  eepromAddress = 0;
  eepromFull = false;
  timestampHours = 1;

  Serial.println("EEPROM cleared. Ready to record new data.");
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    if (input.equalsIgnoreCase("READ")) {
      printEEPROMAsJson();
    }
  }

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    float tempC = getTemp();
    float tempF = tempC * 9.0 / 5.0 + 32.0;

    int tempInt = (int)(tempF * 100);
    unsigned long timestamp = timestampHours;

    if (!eepromFull && eepromAddress + 6 <= EEPROM.length()) {
      EEPROM.put(eepromAddress, timestamp);
      EEPROM.update(eepromAddress + 4, lowByte(tempInt));
      EEPROM.update(eepromAddress + 5, highByte(tempInt));

      eepromAddress += 6;
      timestampHours++;

      Serial.print("Logged: ");
      Serial.print(tempF, 2);
      Serial.print(" F at ");
      Serial.print(timestamp);
      Serial.println(" hour(s)");
    } else if (!eepromFull) {
      Serial.println("EEPROM full. Logging stopped.");
      eepromFull = true;
    }
  }
}

void printEEPROMAsJson() {
  Serial.println("{\"readings\":[");
  for (int i = 0; i + 5 < EEPROM.length(); i += 6) {
    unsigned long timestamp;
    EEPROM.get(i, timestamp);

    if (timestamp == 0xFFFFFFFF || timestamp == 0x00000000) break;

    byte low = EEPROM.read(i + 4);
    byte high = EEPROM.read(i + 5);
    int tempRaw = word(high, low);
    float tempF = tempRaw / 100.0;

    Serial.print("{\"hours\":");
    Serial.print(timestamp);
    Serial.print(",\"temperature_F\":");
    Serial.print(tempF, 2);
    Serial.print("}");

    if (i + 6 < EEPROM.length() && EEPROM.read(i + 6) != 0xFF)
      Serial.println(",");
    else
      Serial.println();
  }
  Serial.println("]}");
}

void clearEEPROM() {
  for (int i = 0; i < EEPROM.length(); i++) {
    EEPROM.update(i, 0xFF);
  }
}

float getTemp() {
  byte data[12];
  byte addr[8];

  if (!ds.search(addr)) {
    ds.reset_search();
    return -1000;
  }

  if (OneWire::crc8(addr, 7) != addr[7]) {
    Serial.println("CRC error");
    return -1000;
  }

  if (addr[0] != 0x10 && addr[0] != 0x28) {
    Serial.println("Unknown device");
    return -1000;
  }

  ds.reset();
  ds.select(addr);
  ds.write(0x44, 1);
  delay(750);

  ds.reset();
  ds.select(addr);
  ds.write(0xBE);

  for (int i = 0; i < 9; i++) {
    data[i] = ds.read();
  }

  ds.reset_search();

  int16_t raw = (data[1] << 8) | data[0];
  return raw / 16.0;
}
