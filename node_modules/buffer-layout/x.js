'use strict';

const lo = require('./lib/Layout');

const raw = Buffer.from('41000000000000000000000000000000000000000000000000000000000000000000000000000000'
                        + '42430000000000000000000000000000000000000000000000000000000000000000000000000000'
                        + '43444500000000000000000000000000000000000000000000000000000000000000000000000000'
                        + '44454647000000000000000000000000000000000000000000000000000000000000000000000000',
                        'hex');

const lo1 = lo.seq(lo.seq(lo.u8(), 40), 4);
const lo2 = lo.seq(lo.cstr(), 4);

console.dir(lo1.decode(raw))
console.dir(lo2.decode(raw))

class ConstantDiscriminator extends lo.UnionDiscriminator {
  constructor(tag, property) {
    super(property);
    this.tag = tag;
  }

  decode (b, offset) {
    return this.tag;
  }

  encode (b, offset) {
    return 0;
  }
}
const discr = new ConstantDiscriminator(0);

const str40 = lo.union(discr, lo.blob(40));
str40.addVariant(discr.tag, lo.cstr(), 's');
const lo3 = lo.seq(str40, 4);
console.dir(lo3.decode(raw))
