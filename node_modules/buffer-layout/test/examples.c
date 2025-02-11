#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <inttypes.h>
#include <assert.h>

void
hexlify (const char * tag,
         const void * sp,
         size_t count)
{
  const uint8_t * u8p = (const uint8_t *)sp;
  const uint8_t * const u8pe = u8p + count;
  printf("%s: ", tag);
  while (u8p < u8pe) {
    printf("%02x", *u8p);
    ++u8p;
  }
  putchar('\n');
}

void
ex_struct (void)
{
  struct ds {
    uint8_t v;
    uint32_t u32;
  } st;
  memset(&st, 0xbd, sizeof(st));
  st.v = 1;
  st.u32 = 0x12345678;
  hexlify("C struct", &st, sizeof(st));
}

void
ex_packed_struct (void)
{
  struct ds {
    uint8_t v;
    uint32_t u32;
  } __attribute__((__packed__)) st;
  memset(&st, 0xbd, sizeof(st));
  st.v = 1;
  st.u32 = 0x12345678;
  hexlify("packed C struct", &st, sizeof(st));
}

void
ex_cstr (void)
{
  const char str[] = "hi!";
  hexlify("C string", str, 1+strlen(str));
}

void
ex_bitfield (void)
{
  struct ds {
    unsigned int b00l03: 3;
    unsigned int b03l01: 1;
    unsigned int b04l18: 24;
    unsigned int b1Cl04: 4;
  } st;
  assert(4 == sizeof(st));
  memset(&st, 0xFF, sizeof(st));
  st.b00l03 = 3;
  st.b04l18 = 24;
  st.b1Cl04 = 4;
  hexlify("bitfield lsb on le", &st, sizeof(st));
}

void
ex_arr4s16 (void)
{
  int16_t arr[4] = { 1, -1, 3, -3 };
  hexlify("arr[4] int16_t", arr, sizeof(arr));
}

void
ex_union4B (void)
{
  struct {
    uint8_t t;
    union ds {
      uint8_t u8[4];
      int16_t s16[2];
      uint32_t u32;
      float f32;
    } u;
  } __attribute__((__packed__)) un;
  un.t = 'w';
  un.u.u32 = 0x12345678;
  hexlify("un u32", &un, sizeof(un));
  un.t = 'f';
  un.u.f32 = 23.625;
  hexlify("un f32", &un, sizeof(un));
  memset(&un, 0xa5, sizeof(un));
  hexlify("un dflt", &un, sizeof(un));
}

int
main (int argc,
      char * argv[])
{
  ex_struct();
  ex_packed_struct();
  ex_cstr();
  ex_bitfield();
  ex_arr4s16();
  ex_union4B();
  return EXIT_SUCCESS;
}
