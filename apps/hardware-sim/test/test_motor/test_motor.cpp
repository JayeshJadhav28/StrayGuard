#include <unity.h>

void setUp() {}
void tearDown() {}

void test_speed_to_duty_0()
{
    int duty = map(0, 0, 100, 0, 255);
    TEST_ASSERT_EQUAL(0, duty);
}

void test_speed_to_duty_100()
{
    int duty = map(100, 0, 100, 0, 255);
    TEST_ASSERT_EQUAL(255, duty);
}

void test_speed_to_duty_50()
{
    int duty = map(50, 0, 100, 0, 255);
    TEST_ASSERT_EQUAL(127, duty);
}

void test_speed_to_duty_80()
{
    int duty = map(80, 0, 100, 0, 255);
    TEST_ASSERT_EQUAL(204, duty);
}

void test_speed_clamp_over()
{
    int speed = constrain(120, 0, 100);
    TEST_ASSERT_EQUAL(100, speed);
}

void test_speed_clamp_under()
{
    int speed = constrain(-10, 0, 100);
    TEST_ASSERT_EQUAL(0, speed);
}

void setup()
{
    UNITY_BEGIN();
    RUN_TEST(test_speed_to_duty_0);
    RUN_TEST(test_speed_to_duty_100);
    RUN_TEST(test_speed_to_duty_50);
    RUN_TEST(test_speed_to_duty_80);
    RUN_TEST(test_speed_clamp_over);
    RUN_TEST(test_speed_clamp_under);
    UNITY_END();
}

void loop() {}
