#include <Arduino.h>
#include <WebServer.h>

#include "motor_control.h"
#include "wifi_server.h"

int g_currentSpeedPct = 0;
WebServer server(80);

enum DemoState
{
    DEMO_IDLE,
    DEMO_NORMAL,
    DEMO_ANIMAL,
    DEMO_ZONE,
    DEMO_RESUME
};
DemoState g_demoState = DEMO_IDLE;

void setup()
{
    Serial.begin(115200);
    delay(500);
    Serial.println("\n=== StrayGuard Hardware Sim ===");

    motorSetup();
    wifiServerSetup();

    setSpeedPct(0);
    Serial.println("[READY] Connect phone to WiFi: " WIFI_SSID);
    Serial.println("[READY] Password: " WIFI_PASSWORD);
    Serial.println("[READY] ESP32 IP: 192.168.4.1");
    Serial.println("[CMD] POST http://192.168.4.1/speed?speed=80");
}

void loop()
{
    server.handleClient();

    if (Serial.available())
    {
        String cmd = Serial.readStringUntil('\n');
        cmd.trim();

        if (cmd.startsWith("speed "))
        {
            setSpeedPct(cmd.substring(6).toInt());
        }
        else if (cmd == "stop")
        {
            setSpeedPct(0);
        }
        else if (cmd == "status")
        {
            Serial.printf("[STATUS] Speed: %d%%  Uptime: %lus\n", g_currentSpeedPct, millis() / 1000);
        }
        else if (cmd == "demo")
        {
            Serial.println("[DEMO] Running auto demo sequence...");
            setSpeedPct(80);
            delay(3000);
            Serial.println("[DEMO] Animal detected! Slowing...");
            setSpeedPct(30);
            delay(3000);
            Serial.println("[DEMO] Danger zone entry...");
            setSpeedPct(50);
            delay(3000);
            Serial.println("[DEMO] Zone cleared. Resuming...");
            setSpeedPct(80);
        }
    }
}
