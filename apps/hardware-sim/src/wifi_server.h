#pragma once

#include <Arduino.h>
#include <WebServer.h>
#include <WiFi.h>

#include "motor_control.h"

#define WIFI_SSID "StrayGuard-Sim"
#define WIFI_PASSWORD "demo1234"

extern WebServer server;

inline void handleSpeedPost()
{
    if (!server.hasArg("speed"))
    {
        server.send(400, "application/json", "{\"error\":\"missing ?speed param\"}");
        return;
    }

    const int speed = server.arg("speed").toInt();
    setSpeedPct(speed);
    const String body = "{\"ok\":true,\"speed\":" + String(g_currentSpeedPct) + "}";
    server.send(200, "application/json", body);
}

inline void handleStatusGet()
{
    const String body = "{\"speed\":" + String(g_currentSpeedPct) + ",\"uptime_s\":" + String(millis() / 1000) + "}";
    server.send(200, "application/json", body);
}

inline void handleOptions()
{
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(204);
}

inline void wifiServerSetup()
{
    WiFi.softAP(WIFI_SSID, WIFI_PASSWORD);
    Serial.printf("[WIFI] AP started. SSID: %s  IP: %s\n", WIFI_SSID, WiFi.softAPIP().toString().c_str());

    server.on("/speed", HTTP_POST, handleSpeedPost);
    server.on("/speed", HTTP_OPTIONS, handleOptions);
    server.on("/status", HTTP_GET, handleStatusGet);

    server.onNotFound([]()
                      { server.send(404, "application/json", "{\"error\":\"not found\",\"uri\":\"" + server.uri() + "\"}"); });

    server.begin();
    Serial.println("[WIFI] HTTP server started on port 80");
}
