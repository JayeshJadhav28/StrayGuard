# StrayGuard Hardware Simulation

ESP32 RC-car rig for the StrayGuard demo. The firmware exposes an AP-mode HTTP server that accepts speed commands from the Flutter app.

## Components

- ESP32 DevKit v1
- L298N dual motor driver
- 2x TT DC motors
- 2WD chassis and wheels
- 2x 18650 Li-ion cells with holder

## Wiring

- GPIO 14 -> IN1
- GPIO 27 -> IN2
- GPIO 26 -> IN3
- GPIO 25 -> IN4
- GPIO 12 -> ENA
- GPIO 13 -> ENB
- GND must be common across ESP32, L298N, and battery

## Flash

```bash
cd apps/hardware-sim
pio run --target upload
pio device monitor
```

## HTTP control

```bash
curl -X POST "http://192.168.4.1/speed?speed=80"
curl -X POST "http://192.168.4.1/speed?speed=30"
curl "http://192.168.4.1/status"
```

## Serial commands

- `speed 80`
- `speed 30`
- `stop`
- `status`
- `demo`
