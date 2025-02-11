/* Show 64-bit integer values with round-trip through
 * double-precision.
 *
 * Compile with: gcc -std=c11 */
#include <inttypes.h>
#include <stdio.h>
#include <stdlib.h>
#include <float.h>

static const uint32_t usval = 0x76543210;
static const uint32_t offset = 0x2345;

static void
display_u64 (uint64_t val)
{
    double dval = val;
    uint64_t rval = dval;
    printf("%016" PRIx64 " : %" PRIu64 "\n"
           "\t%a : %.*g : err %" PRId64 "\n"
           "\t%016" PRIx64 " : %" PRIu64 "\n",
           val, val,
           dval, DBL_DECIMAL_DIG, dval, (int64_t)(rval - val),
           rval, rval);
}

static void
display_s64 (int64_t val)
{
    double dval = val;
    int64_t rval = dval;
    printf("%016" PRIx64 " : %" PRId64 "\n"
           "\t%a : %.*g : err %" PRId64 "\n"
           "\t%016" PRIx64 " : %" PRId64 "\n",
           val, val,
           dval, DBL_DECIMAL_DIG, dval, (int64_t)(rval - val),
           rval, rval);
}


static void
gen_s (void)
{
  printf("Shifted:\n");
  uint64_t val = usval;
  unsigned int sc = 0;
  while (33 >= sc) {
    display_u64(val);
    val = (2 * val) + offset;
    ++sc;
  }
}

static void
gen_sn (void)
{
  printf("Shifted Negated:\n");
  uint64_t val = usval;
  unsigned int sc = 0;
  while (33 >= sc) {
    display_s64(-val);
    val = (2 * val) + offset;
    ++sc;
  }
}

int main (void)
{
  gen_s();
  gen_sn();
  return EXIT_SUCCESS;
}
