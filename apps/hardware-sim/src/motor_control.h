#pragma once

#include <Arduino.h>

// GPIO assignments (match your wiring)
#define PIN_IN1 14 // Motor A forward
#define PIN_IN2 27 // Motor A backward (keep LOW)
#define PIN_IN3 26 // Motor B forward
#define PIN_IN4 25 // Motor B backward (keep LOW)
#define PIN_ENA 12 // PWM speed Motor A
#define PIN_ENB 13 // PWM speed Motor B
#define PIN_LED 2  // Built-in blue LED = connected indicator

// LEDC PWM channels
#define PWM_CH_A 0
#define PWM_CH_B 1
#define PWM_FREQ 1000
#define PWM_RES 8

extern int g_currentSpeedPct;

inline void motorSetup()
{
    pinMode(PIN_IN1, OUTPUT);
    pinMode(PIN_IN2, OUTPUT);
    pinMode(PIN_IN3, OUTPUT);
    pinMode(PIN_IN4, OUTPUT);

    digitalWrite(PIN_IN1, HIGH);
    digitalWrite(PIN_IN2, LOW);
    digitalWrite(PIN_IN3, HIGH);
    digitalWrite(PIN_IN4, LOW);

    pinMode(PIN_LED, OUTPUT);
    digitalWrite(PIN_LED, LOW);

    ledcSetup(PWM_CH_A, PWM_FREQ, PWM_RES);
    ledcSetup(PWM_CH_B, PWM_FREQ, PWM_RES);
    ledcAttachPin(PIN_ENA, PWM_CH_A);
    ledcAttachPin(PIN_ENB, PWM_CH_B);
}

inline void setSpeedPct(int pct)
{
    pct = constrain(pct, 0, 100);
    g_currentSpeedPct = pct;
    const int duty = map(pct, 0, 100, 0, 255);
    ledcWrite(PWM_CH_A, duty);
    ledcWrite(PWM_CH_B, duty);
    Serial.printf("[MOTOR] Speed: %d%% -> duty: %d\n", pct, duty);
    digitalWrite(PIN_LED, pct > 0 ? HIGH : LOW);
}
