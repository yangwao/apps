// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { StorageEntryPromise } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';

import React from 'react';
import { withApi } from '@polkadot/ui-api';

import Dropdown from '../Dropdown';
import { classes } from '../util';

type Props = ApiProps & BareProps & {
  isError?: boolean,
  onChange: (value: StorageEntryPromise) => void,
  options: DropdownOptions,
  value: StorageEntryPromise
};

class SelectKey extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, isError, onChange, options, style, value } = this.props;

    if (!options.length) {
      return null;
    }

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Items', className)}
        isError={isError}
        onChange={onChange}
        options={options}
        style={style}
        transform={this.transform}
        value={value.creator.method}
        withLabel={false}
      />
    );
  }

  private transform = (method: string): StorageEntryPromise => {
    const { api, value } = this.props;

    // We should not get to the fallback, but ... https://github.com/polkadot-js/apps/issues/1375
    return api.query[value.creator.section]
      ? api.query[value.creator.section][method]
      : value;
  }
}

export default withApi(SelectKey);
