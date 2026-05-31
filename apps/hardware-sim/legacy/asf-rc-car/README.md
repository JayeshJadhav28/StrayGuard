# Legacy ASF RC-Car Firmware

This directory stores the MCU firmware you shared for the sensor-driven RC car prototype.

It is intentionally kept separate from the active ESP32/PlatformIO simulation because it depends on ASF peripherals such as `asf.h`, `i2c_master_module`, and `adc_module` rather than the ESP32 Arduino framework.

## Contents

- `src/main.c` - Combined LCD, ADXL345, MQ2, and hall sensor firmware

## Notes

- The code is preserved as a reference implementation and can be moved into a proper ASF project later if you want to flash the original controller board.
- The current StrayGuard demo still uses `apps/hardware-sim/src/main.cpp` for ESP32 speed-command simulation.
