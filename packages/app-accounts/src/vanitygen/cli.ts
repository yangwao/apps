#!/usr/bin/env node
// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeypairType } from '@polkadot/util-crypto/types';
import { Generator$Options } from './types';

import yargs from 'yargs';
import chalk from 'chalk';
import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import generator from '.';
import matchRegex from './regex';

type Best = {
  address: string,
  count: number,
  offset: number,
  seed?: Uint8Array
};

const { match, type, withCase } = yargs
  .option('match', {
    default: 'EEEEE'
  })
  .option('type', {
    choices: ['ed25519', 'sr25519'],
    default: 'sr25519'
  })
  .option('withCase', {
    default: true
  })
  .argv;

const INDICATORS = ['|', '/', '-', '\\'];
const NUMBER_REGEX = new RegExp('(\\d+?)(?=(\\d{3})+(?!\\d)|$)', 'g');

const options: Generator$Options = {
  match: `${match}`,
  runs: 50,
  type: type as KeypairType,
  withCase
};
const startAt = Date.now();
let best: Best = {
  address: '',
  count: -1,
  offset: 65536
};
let total: number = 0;
let indicator = -1;

if (!matchRegex.test(match)) {
  console.error("Invalid character found in match string, allowed is '1-9' (no '0'), 'A-H, J-N & P-Z' (no 'I' or 'O'), 'a-k & m-z' (no 'l') and '?' (wildcard)");
  process.exit(-1);
}

console.log(options);

function showProgress () {
  const elapsed = (Date.now() - startAt) / 1000;

  indicator++;

  if (indicator === INDICATORS.length) {
    indicator = 0;
  }

  process.stdout.write(`\r[${INDICATORS[indicator]}] ${(total.toString().match(NUMBER_REGEX) || []).join(',')} keys in ${(elapsed).toFixed(2)}s (${(total / elapsed).toFixed(0)} keys/s)`);
}

function showBest () {
  const { address, count, offset, seed } = best;

  console.log(`\r::: ${address.slice(0, offset)}${chalk.cyan(address.slice(offset, count + offset))}${address.slice(count + offset)} <= ${u8aToHex(seed)} (count=${count}, offset=${offset})`);
}

cryptoWaitReady()
  .then(() => {
    while (true) {
      const nextBest = generator(options).found.reduce((best, match) => {
        if ((match.count > best.count) || ((match.count === best.count) && (match.offset <= best.offset))) {
          return match;
        }

        return best;
      }, best);

      total += options.runs;

      if (nextBest.address !== best.address) {
        best = nextBest;
        showBest();
        showProgress();
      } else if ((total % 1000) === 0) {
        showProgress();
      }
    }
  })
  .catch(console.error);
