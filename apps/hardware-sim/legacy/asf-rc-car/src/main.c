#include "asf.h"
#include <stdio.h>
#include <stdlib.h>

/* ===================================================== */
/* ================= LCD DEFINITIONS =================== */
/* ===================================================== */

#define LCD_ADDR 0x27

#define LCD_BACKLIGHT 0x08
#define LCD_ENABLE 0x04
#define LCD_RS 0x01

/* ===================================================== */
/* ================= ADXL345 DEFINITIONS =============== */
/* ===================================================== */

#define ADXL345_ADDR 0x53

#define POWER_CTL 0x2D
#define DATA_FORMAT 0x31
#define DATAX0 0x32

/* ===================================================== */
/* ================= GLOBAL INSTANCES ================== */
/* ===================================================== */

struct i2c_master_module i2c_instance;
struct adc_module adc_instance;
volatile uint32_t pulse_count = 0;
uint8_t previous_hall_state = 1;

/* ===================================================== */
/* ================= I2C CONFIG ======================== */
/* ===================================================== */

void configure_i2c(void)
{
    struct i2c_master_config config_i2c;

    i2c_master_get_config_defaults(&config_i2c);

    config_i2c.baud_rate = I2C_MASTER_BAUD_RATE_100KHZ;

    config_i2c.pinmux_pad0 = PINMUX_PA08C_SERCOM0_PAD0;
    config_i2c.pinmux_pad1 = PINMUX_PA09C_SERCOM0_PAD1;

    while (i2c_master_init(&i2c_instance,
                           SERCOM0,
                           &config_i2c) != STATUS_OK)
    {
    }

    i2c_master_enable(&i2c_instance);
}

/* ===================================================== */
/* ================= LCD FUNCTIONS ===================== */
/* ===================================================== */

void lcd_write(uint8_t data)
{
    struct i2c_master_packet packet;

    packet.address = LCD_ADDR;
    packet.data_length = 1;
    packet.data = &data;
    packet.ten_bit_address = false;
    packet.high_speed = false;
    packet.hs_master_code = 0;

    i2c_master_write_packet_wait(&i2c_instance, &packet);

    delay_ms(1);
}

void lcd_pulse(uint8_t data)
{
    lcd_write(data | LCD_ENABLE);

    delay_ms(1);

    lcd_write(data & ~LCD_ENABLE);

    delay_ms(1);
}

void lcd_send_nibble(uint8_t nibble, uint8_t rs)
{
    uint8_t data;

    data = (nibble << 4);

    data |= LCD_BACKLIGHT;

    if (rs)
    {
        data |= LCD_RS;
    }

    lcd_pulse(data);
}

void lcd_cmd(uint8_t cmd)
{
    lcd_send_nibble(cmd >> 4, 0);
    lcd_send_nibble(cmd & 0x0F, 0);

    delay_ms(2);
}

void lcd_data(uint8_t value)
{
    lcd_send_nibble(value >> 4, 1);
    lcd_send_nibble(value & 0x0F, 1);

    delay_ms(2);
}

void lcd_init(void)
{
    delay_ms(50);

    lcd_send_nibble(0x03, 0);
    delay_ms(5);

    lcd_send_nibble(0x03, 0);
    delay_ms(5);

    lcd_send_nibble(0x03, 0);
    delay_ms(5);

    lcd_send_nibble(0x02, 0);
    delay_ms(5);

    lcd_cmd(0x28);
    lcd_cmd(0x0C);
    lcd_cmd(0x06);
    lcd_cmd(0x01);

    delay_ms(5);
}

void lcd_print(char *str)
{
    while (*str)
    {
        lcd_data(*str++);
    }
}

/* ===================================================== */
/* ================= ADXL345 FUNCTIONS ================= */
/* ===================================================== */

void adxl345_write(uint8_t reg, uint8_t value)
{
    uint8_t data[2];

    struct i2c_master_packet packet;

    data[0] = reg;
    data[1] = value;

    packet.address = ADXL345_ADDR;
    packet.data_length = 2;
    packet.data = data;
    packet.ten_bit_address = false;
    packet.high_speed = false;
    packet.hs_master_code = 0;

    i2c_master_write_packet_wait(&i2c_instance, &packet);

    delay_ms(10);
}

void adxl345_init(void)
{
    adxl345_write(DATA_FORMAT, 0x08);
    adxl345_write(POWER_CTL, 0x08);
}

int16_t adxl345_read_x(void)
{
    uint8_t reg = DATAX0;
    uint8_t data[2];

    struct i2c_master_packet packet;

    packet.address = ADXL345_ADDR;
    packet.data_length = 1;
    packet.data = &reg;
    packet.ten_bit_address = false;
    packet.high_speed = false;
    packet.hs_master_code = 0;

    if (i2c_master_write_packet_wait(&i2c_instance, &packet) != STATUS_OK)
    {
        return 0;
    }

    delay_ms(5);

    packet.address = ADXL345_ADDR;
    packet.data_length = 2;
    packet.data = data;

    if (i2c_master_read_packet_wait(&i2c_instance, &packet) != STATUS_OK)
    {
        return 0;
    }

    return (int16_t)((data[1] << 8) | data[0]);
}

/* ===================================================== */
/* ================= MQ2 ADC FUNCTIONS ================= */
/* ===================================================== */

void adc_configure(void)
{
    struct adc_config config_adc;

    adc_get_config_defaults(&config_adc);

    config_adc.positive_input = ADC_POSITIVE_INPUT_PIN0; // PA02
    config_adc.reference = ADC_REFERENCE_INTVCC1;

    adc_init(&adc_instance, ADC, &config_adc);

    adc_enable(&adc_instance);
}

uint16_t mq2_read(void)
{
    uint16_t result;

    adc_start_conversion(&adc_instance);

    while (adc_read(&adc_instance, &result) != STATUS_OK)
    {
    }

    return result;
}
/* ===================================================== */
/* ================= A3144 HALL SENSOR ================= */
/* ===================================================== */

void hall_sensor_init(void)
{
    struct port_config config_port;

    port_get_config_defaults(&config_port);

    config_port.direction = PORT_PIN_DIR_INPUT;
    config_port.input_pull = PORT_PIN_PULL_UP;

    port_pin_set_config(PIN_PA15, &config_port);
}

uint8_t hall_read(void)
{
    return port_pin_get_input_level(PIN_PA15);
}

/* ===================================================== */
/* ======================= MAIN ======================== */
/* ===================================================== */

int main(void)
{
    int16_t current_x;
    int16_t previous_x = 0;

    int vibration;

    uint16_t gas_value;

    uint8_t hall_state;

    uint32_t rpm = 0;
    uint32_t last_pulse_count = 0;

    char line1[17];
    char line2[17];

    system_init();

    delay_init();

    configure_i2c();

    lcd_init();

    adxl345_init();

    adc_configure();

    hall_sensor_init();

    lcd_cmd(0x01);

    while (1)
    {
        /* ---------- ADXL345 ---------- */

        current_x = adxl345_read_x();

        vibration = abs(current_x - previous_x);

        previous_x = current_x;

        /* ---------- MQ2 ---------- */

        gas_value = mq2_read();

        /* ---------- Hall Sensor ---------- */

        pulse_count = 0;

        uint32_t start_time = 0;

        while (start_time < 1000)
        {
            hall_state = hall_read();

            /* Falling edge detection */
            if ((previous_hall_state == 1) && (hall_state == 0))
            {
                pulse_count++;
            }

            previous_hall_state = hall_state;

            delay_ms(1);

            start_time++;
        }

        rpm = pulse_count * 60; /* 1 magnet */

        /* ---------- LCD ---------- */

        lcd_cmd(0x80);

        sprintf(line1, "V:%3d G:%4u", vibration, gas_value);

        lcd_print(line1);

        lcd_cmd(0xC0);

        sprintf(line2, "RPM:%4lu    ", rpm);

        lcd_print(line2);
    }
}