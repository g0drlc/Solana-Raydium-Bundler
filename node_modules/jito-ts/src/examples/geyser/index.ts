require('dotenv').config();

import {PublicKey} from '@solana/web3.js';

import {geyserClient} from '../../sdk';

const main = async () => {
  const geyserUrl = process.env.GEYSER_URL || '';
  const geyserAccessToken = process.env.GEYSER_ACCESS_TOKEN || '';
  console.log(`GEYSER_URL: ${geyserUrl}`);

  const _accounts = (process.env.ACCOUNTS_OF_INTEREST || '').split(',');
  console.log(`ACCOUNTS_OF_INTEREST: ${_accounts}`);
  const accounts = _accounts.map(a => new PublicKey(a));

  const _programs = (process.env.PROGRAMS_OF_INTEREST || '').split(',');
  console.log(`PROGRAMS_OF_INTEREST: ${_programs}`);
  const programs = _programs.map(p => new PublicKey(p));

  const c = geyserClient(geyserUrl, geyserAccessToken);

  const heartbeatMs = await c.getHeartbeatIntervalMillis();
  console.log(`Heartbeat Millis: ${heartbeatMs}`);

  c.onAccountUpdate(
    accounts,
    resp => {
      console.log(`received account update: ${resp.accountUpdate?.seq}`);
    },
    e => {
      console.error(`received account update error: ${e}`);
      throw e;
    }
  );

  c.onProgramUpdate(
    programs,
    resp => {
      console.log(`received program update: ${resp.accountUpdate?.seq}`);
    },
    e => {
      console.error(`received program update error: ${e}`);
      throw e;
    }
  );

  c.onProcessedBlock(
    resp => {
      console.log(`received processed block: ${resp.blockUpdate?.slot}`);
    },
    e => {
      console.error(`block update stream error: ${e}`);
      throw e;
    }
  );
};

main()
  .then(() => console.log('running geyser example'))
  .catch(e => {
    console.error(`error: ${e}`);
  });
