import { PublicKey } from '@solana/web3.js';
import convict from 'convict';
import * as dotenv from 'dotenv';
dotenv.config();

const config = convict({
  bot_name: {
    format: String,
    default: 'local',
    env: 'BOT_NAME',
  },
  num_worker_threads: {
    format: Number,
    default: 4,
    env: 'NUM_WORKER_THREADS',
  },
  block_engine_urls: {
    format: Array,
    default: ['frankfurt.mainnet.block-engine.jito.wtf'],
    doc: 'block engine urls. bot will mempool subscribe to all and send bundles to first one',
    env: 'BLOCK_ENGINE_URLS',
  },
  auth_keypair_path: {
    format: String,
    default: './blockengine.json',
    env: 'AUTH_KEYPAIR_PATH',
  },
  rpc_url: {
    format: String,
    default: 'https://api.mainnet-beta.solana.com',
    env: 'RPC_URL',
  },
  rpc_requests_per_second: {
    format: Number,
    default: 0,
    env: 'RPC_REQUESTS_PER_SECOND',
  },
  rpc_max_batch_size: {
    format: Number,
    default: 20,
    env: 'RPC_MAX_BATCH_SIZE',
  },
  geyser_url: {
    format: String,
    default: 'mainnet.rpc.jito.wtf',
    env: 'GEYSER_URL',
  },
  geyser_access_token: {
    format: String,
    default: '00000000-0000-0000-0000-000000000000',
    env: 'GEYSER_ACCESS_TOKEN',
  },
  arb_calculation_num_steps: {
    format: Number,
    default: 3,
    env: 'ARB_CALCULATION_NUM_STEPS',
  },
  max_arb_calculation_time_ms: {
    format: Number,
    default: 15,
    env: 'MAX_ARB_CALCULATION_TIME_MS',
  },
  payer_keypair_path: {
    format: String,
    default: './payer.json',
    env: 'PAYER_KEYPAIR_PATH',
  },
  min_tip_lamports: {
    format: Number,
    default: 10000,
    env: 'MIN_TIP_LAMPORTS',
  },
  tip_percent: {
    format: Number,
    default: 50,
    env: 'TIP_PERCENT',
  },
});

config.validate({ allowed: 'strict' });


const TIP_ACCOUNTS = [
    '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
    'HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe',
    'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
    'ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49',
    'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
    'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
    'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
    '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT',
  ].map((pubkey) => new PublicKey(pubkey));
  
  const getRandomTipAccount = () =>
  TIP_ACCOUNTS[Math.floor(Math.random() * TIP_ACCOUNTS.length)];

    
    
export { config ,getRandomTipAccount};