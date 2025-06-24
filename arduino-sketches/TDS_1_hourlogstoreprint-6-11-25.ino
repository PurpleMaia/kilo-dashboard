#include <EEPROM.h>

#define TdsSensorPin A1
#define VREF 5.0
#define SCOUNT 30
#define EEPROM_SIZE 1024

int analogBuffer[SCOUNT];
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0, copyIndex = 0;
float averageVoltage = 0, tdsValue = 0, temperature = 25;

unsigned long startMillis = 0;
int eepromAddress = 0;
bool eepromFull = false;
bool recordingStarted = false;

// === SAMPLE RATE CONFIGURATION ===
// Set the time between each sample in milliseconds.
// For example:
//    1 minute  = 60,000 ms
//    15 minutes = 900,000 ms
unsigned long sampleIntervalMs = 3600000;  // <-- Change this to adjust sample rate
// =================================

void setup()
{
    Serial.begin(9600);
    while (!Serial);  // Wait for Serial to open on boards like Leonardo
    pinMode(TdsSensorPin, INPUT);

    // Print stored EEPROM data
    Serial.println("Reading EEPROM data:");
    int addr = 0;
    while (addr + sizeof(unsigned long) + sizeof(float) <= EEPROM_SIZE)
    {
        unsigned long timeStamp;
        float tds;
        EEPROM.get(addr, timeStamp);
        addr += sizeof(unsigned long);

        EEPROM.get(addr, tds);
        addr += sizeof(float);

        if (timeStamp == 0xFFFFFFFF || timeStamp == 0 || isnan(tds)) break;

        Serial.print("Time: ");
        Serial.print(timeStamp);
        Serial.print(" ms, TDS: ");
        Serial.print(tds, 0);
        Serial.println(" ppm");
    }

    Serial.println("Waiting 30 seconds before clearing EEPROM...");
    delay(30000);

    // Clear EEPROM for new session
    Serial.println("Clearing EEPROM...");
    for (int i = 0; i < EEPROM_SIZE; i++)
    {
        EEPROM.write(i, 0xFF);
    }

    Serial.println("EEPROM cleared. Starting new recording session.");
    startMillis = millis();
    eepromAddress = 0;
    eepromFull = false;
    recordingStarted = true;
}

void loop()
{
    if (!recordingStarted || eepromFull) return;

    // Sample input every 40 ms to keep buffer full
    static unsigned long analogSampleTimepoint = millis();
    if (millis() - analogSampleTimepoint > 40U)
    {
        analogSampleTimepoint = millis();
        analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);
        analogBufferIndex++;
        if (analogBufferIndex == SCOUNT)
            analogBufferIndex = 0;
    }

    // Main TDS logging interval (user-configurable)
    static unsigned long printTimepoint = millis();
    if (millis() - printTimepoint >= sampleIntervalMs)
    {
        printTimepoint = millis();

        // Get median of readings for stable result
        for (copyIndex = 0; copyIndex < SCOUNT; copyIndex++)
            analogBufferTemp[copyIndex] = analogBuffer[copyIndex];

        averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 1024.0;
        float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
        float compensationVolatge = averageVoltage / compensationCoefficient;
        tdsValue = (133.42 * pow(compensationVolatge, 3) - 255.86 * pow(compensationVolatge, 2) + 857.39 * compensationVolatge) * 0.5;

        unsigned long elapsedMillis = millis() - startMillis + 1;

        Serial.print("Time: ");
        Serial.print(elapsedMillis);
        Serial.print(" ms, TDS Value: ");
        Serial.print(tdsValue, 0);
        Serial.println(" ppm");

        // Write to EEPROM
        if (eepromAddress + sizeof(unsigned long) + sizeof(float) <= EEPROM_SIZE)
        {
            EEPROM.put(eepromAddress, elapsedMillis);
            eepromAddress += sizeof(unsigned long);

            EEPROM.put(eepromAddress, tdsValue);
            eepromAddress += sizeof(float);
        }
        else
        {
            Serial.println("EEPROM full. Recording stopped.");
            eepromFull = true;
        }
    }
}

int getMedianNum(int bArray[], int iFilterLen)
{
    int bTab[iFilterLen];
    for (byte i = 0; i < iFilterLen; i++)
        bTab[i] = bArray[i];

    int i, j, bTemp;
    for (j = 0; j < iFilterLen - 1; j++)
    {
        for (i = 0; i < iFilterLen - j - 1; i++)
        {
            if (bTab[i] > bTab[i + 1])
            {
                bTemp = bTab[i];
                bTab[i] = bTab[i + 1];
                bTab[i + 1] = bTemp;
            }
        }
    }

    if ((iFilterLen & 1) > 0)
        bTemp = bTab[(iFilterLen - 1) / 2];
    else
        bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;

    return bTemp;
}
