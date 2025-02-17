// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { withCalls } from '@polkadot/ui-api';
import { CardGrid } from '@polkadot/ui-app';

import Motion from './Motion';
import Propose from './Propose';
import translate from '../translate';

type Props = I18nProps & {
  councilMotions_proposals?: Array<Hash>
};

class Motions extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <CardGrid
        emptyText={t('No council motions')}
        headerText={t('Motions')}
        buttons={
          <Propose />
        }
      >
        {this.renderMotions()}
      </CardGrid>
    );
  }

  private renderMotions () {
    const { councilMotions_proposals = [] } = this.props;

    return councilMotions_proposals.map((hash) => (
      <Motion
        hash={hash.toHex()}
        key={hash.toHex()}
      />
    ));
  }
}

export default translate(
  withCalls<Props>(
    'query.councilMotions.proposals'
  )(Motions)
);
