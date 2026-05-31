#ifndef ASF_H
#define ASF_H

#include <stdbool.h>
#include <stdint.h>

#define STATUS_OK 0
#define I2C_MASTER_BAUD_RATE_100KHZ 100000

#define ADC_POSITIVE_INPUT_PIN0 0
#define ADC_REFERENCE_INTVCC1 0

#define PORT_PIN_DIR_INPUT 0
#define PORT_PIN_PULL_UP 0

#define PINMUX_PA08C_SERCOM0_PAD0 0
#define PINMUX_PA09C_SERCOM0_PAD1 0
#define SERCOM0 0
#define ADC 0
#define PIN_PA15 15

struct i2c_master_module
{
    int unused;
};

struct adc_module
{
    int unused;
};

struct i2c_master_config
{
    uint32_t baud_rate;
    uint32_t pinmux_pad0;
    uint32_t pinmux_pad1;
};

struct i2c_master_packet
{
    uint8_t address;
    uint16_t data_length;
    uint8_t *data;
    bool ten_bit_address;
    bool high_speed;
    uint8_t hs_master_code;
};

struct adc_config
{
    uint32_t positive_input;
    uint32_t reference;
};

struct port_config
{
    uint32_t direction;
    uint32_t input_pull;
};

static inline void system_init(void) {}
static inline void delay_init(void) {}
static inline void delay_ms(uint32_t ms)
{
    (void)ms;
}

static inline void i2c_master_get_config_defaults(struct i2c_master_config *config)
{
    if (config)
    {
        config->baud_rate = I2C_MASTER_BAUD_RATE_100KHZ;
        config->pinmux_pad0 = PINMUX_PA08C_SERCOM0_PAD0;
        config->pinmux_pad1 = PINMUX_PA09C_SERCOM0_PAD1;
    }
}

static inline int i2c_master_init(struct i2c_master_module *module, int sercom, const struct i2c_master_config *config)
{
    (void)module;
    (void)sercom;
    (void)config;
    return STATUS_OK;
}

static inline void i2c_master_enable(struct i2c_master_module *module)
{
    (void)module;
}

static inline int i2c_master_write_packet_wait(struct i2c_master_module *module, const struct i2c_master_packet *packet)
{
    (void)module;
    (void)packet;
    return STATUS_OK;
}

static inline int i2c_master_read_packet_wait(struct i2c_master_module *module, const struct i2c_master_packet *packet)
{
    (void)module;
    (void)packet;
    return STATUS_OK;
}

static inline void adc_get_config_defaults(struct adc_config *config)
{
    if (config)
    {
        config->positive_input = ADC_POSITIVE_INPUT_PIN0;
        config->reference = ADC_REFERENCE_INTVCC1;
    }
}

static inline void adc_init(struct adc_module *module, int adc, const struct adc_config *config)
{
    (void)module;
    (void)adc;
    (void)config;
}

static inline void adc_enable(struct adc_module *module)
{
    (void)module;
}

static inline void adc_start_conversion(struct adc_module *module)
{
    (void)module;
}

static inline int adc_read(struct adc_module *module, uint16_t *result)
{
    (void)module;
    if (result)
    {
        *result = 0;
    }
    return STATUS_OK;
}

static inline void port_get_config_defaults(struct port_config *config)
{
    if (config)
    {
        config->direction = PORT_PIN_DIR_INPUT;
        config->input_pull = PORT_PIN_PULL_UP;
    }
}

static inline void port_pin_set_config(uint32_t pin, const struct port_config *config)
{
    (void)pin;
    (void)config;
}

static inline uint8_t port_pin_get_input_level(uint32_t pin)
{
    (void)pin;
    return 1;
}

#endif