import abi from '@starknet-bootcamp/contracts/starknet-artifacts/contracts/Counter.cairo/Counter_abi.json';
import { useContract, useStarknetCall, useStarknetInvoke, useStarknetBlock, useStarknetTransactionManager, useStarknet } from '@starknet-react/core';
import React, { FC, useState } from 'react';
import { Abi } from 'starknet';
import { BigNumberish } from 'starknet/dist/utils/number';
import { compressProgram } from 'starknet/dist/utils/stark';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import Style from './counter.module.scss';

interface Props {
  address: string
}

const Counter: FC<Props> = ({ address }) => {
  const [amount, setAmount] = useState('1');
  const { transactions, refreshTransaction } = useStarknetTransactionManager();
  const {library} = useStarknet();
  const { contract: counterContract } = useContract({ abi: abi as Abi, address });
  const { data: readData, error: readError, loading: readLoading, refresh: readRefresh } = useStarknetCall({ contract: counterContract, method: 'read', args: [] });
  const { data: incData, loading: incLoading, error: incError, reset: incReset, invoke: incInvoke } = useStarknetInvoke({ contract: counterContract, method: 'increment' });
  const counterAmount = (readData || [])[0] as BigNumberish;
  let hasSentTransaction = false;

  const isWaitingTransaction = (txHash: string | undefined) => {
    console.log("txHash", txHash);
    if (txHash) {
      const transactionResponse = library.getTransaction(txHash).then(transaction => {
        hasSentTransaction = (transaction.status !== 'ACCEPTED_ON_L1' &&
          transaction.status !== 'ACCEPTED_ON_L2' &&
          transaction.status !== 'REJECTED');
        readRefresh();
      });
      const transaction = transactions.find(tr => tr.transactionHash === txHash);
      console.log(transactionResponse, txHash);
      return !!transaction && hasSentTransaction; //&& transaction.status !== 'ACCEPTED_ON_L1' && transaction.status !== 'ACCEPTED_ON_L2' && transaction.status !== 'REJECTED';
        // (!!transactionResponse && transactionResponse.status !== 'ACCEPTED_ON_L1' && transactionResponse.status !== 'ACCEPTED_ON_L2' && transactionResponse.status !== 'REJECTED');
    }
    return false;
  }

  const handleOnIncrementClick = async () => {
    const tx = await incInvoke({args: [amount]});
    console.log(tx);
  };
  return (
    <section className="simple-container">
      <h1>Counter</h1>
      <div>
        <p>Value: {counterAmount?.toString()}</p>
          <label className={Style.labelAmount}>
            Increment amount:
            <input className={Style.inputAmount} type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
        <PrimaryButton 
          loading={
            readLoading || 
            !readData || 
            incLoading || 
            isWaitingTransaction(incData) || 
            counterAmount == undefined
          } 
          onClick={handleOnIncrementClick}
        >
          Increment
        </PrimaryButton>
      </div>
      {(!!readError || !!incError) &&
        <>
          <h2 className={Style.errorTitle}>Errors:</h2>
          {!!readError && <span className={Style.errorContent}>{readError}</span>}
          {!!incError && <span className={Style.errorContent}>{incError}</span>}
        </>
      }
    </section>
  );
};

export default Counter;
