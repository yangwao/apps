// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/ui-app';

export type TxModalProps = I18nProps & {
  onSubmit?: () => void,
  onClose?: () => void
  onSuccess?: () => void,
  onFailed?: () => void
};

export type TxModalState = {
  accountId?: string | null,
  isBusy: boolean,
  isOpen: boolean
};

class TxModal<P extends TxModalProps, S extends TxModalState> extends TxComponent<P, S> {
  protected defaultState: S = {
    accountId: null,
    isOpen: false,
    isBusy: false
  } as S;

  state: S = this.defaultState;

  render () {
    const { isOpen } = this.state;

    return (
      <>
        {this.renderTrigger && this.renderTrigger()}
        <Modal
          className='ui--Modal'
          dimmer='inverted'
          onClose={this.hideModal}
          open={isOpen}
        >
          <Modal.Header>
            {this.headerText()}
          </Modal.Header>
          <Modal.Content>
            {this.renderPreContent()}
            {this.renderInputAccount()}
            {this.renderContent()}
          </Modal.Content>
          <Modal.Actions>
            {this.renderButtons()}
          </Modal.Actions>
        </Modal>
      </>
    );
  }

  protected headerText = (): React.ReactNode => '';
  protected accountHelp = (): React.ReactNode => this.props.t('Select the account to use for this action.');
  protected accountLabel = (): React.ReactNode => this.props.t('using my account');
  protected submitLabel = (): React.ReactNode => this.props.t('Submit');
  protected cancelLabel = (): React.ReactNode => this.props.t('Cancel');

  protected onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  protected onSubmit = (): void => {
    const { onSubmit } = this.props;

    this.toggleBusy(true);
    onSubmit && onSubmit();
  }

  protected onSuccess = (): void => {
    const { onClose, onSuccess } = this.props;

    onSuccess && onSuccess();
    onClose && onClose();
    this.hideModal();
  }

  protected onFailed = (): void => {
    const { onFailed } = this.props;

    this.toggleBusy(false);
    onFailed && onFailed();
  }

  isDisabled = (): boolean => {
    const { accountId } = this.state;

    return !accountId;
  }

  protected toggleBusy = (isBusy: boolean) => () => {
    this.setState({
      isBusy
    });
  }

  protected txMethod: () => string = () => '';
  protected txParams: () => Array<any> = () => [];

  protected renderContent: () => React.ReactNode | null = () => null;
  protected renderPreContent: () => React.ReactNode | null = () => null;
  protected renderTrigger?: () => React.ReactNode | null = () => null;

  protected renderButtons: () => React.ReactNode | null = () => {
    return (
      <Button.Group>
        {this.renderCancelButton()}
        {this.renderTxButton()}
      </Button.Group>
    );
  }

  protected renderInputAccount () {
    const { accountId, isBusy } = this.state;

    return (
      <InputAddress
        defaultValue={accountId}
        help={this.accountHelp()}
        isDisabled={isBusy}
        isInput={false}
        label={this.accountLabel()}
        onChange={this.onChangeAccount}
        type='account'
        value={accountId}
      />
    );
  }

  protected renderTxButton () {
    const { accountId } = this.state;

    return (
      <TxButton
        accountId={accountId}
        isDisabled={this.isDisabled()}
        isPrimary
        label={this.submitLabel()}
        onClick={this.onSubmit}
        onFailed={this.onFailed}
        onSuccess={this.onSuccess}
        params={this.txParams()}
        ref={this.button}
        tx={this.txMethod()}
      />
    );
  }

  protected renderCancelButton () {
    const { t } = this.props;

    return (
      <>
        <Button
          isNegative
          onClick={this.hideModal}
          label={t('Cancel')}
        />
        <Button.Or />
      </>
    );
  }

  protected reset = () => {
    this.setState(
      this.defaultState
    );
  }

  protected showModal = () => {
    this.setState({
      isOpen: true
    });
  }

  protected hideModal = () => {
    const { onClose } = this.props;

    onClose && onClose();
    this.setState(
      this.defaultState
    );
  }
}

export default TxModal;
