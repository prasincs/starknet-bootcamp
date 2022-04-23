import { useCallback, useEffect, useState } from 'react';

const getContractsAddresses = () => {
  const network = 'devnet';
  const [counterAddress, setCounterAddress] = useState<string>();
  const [rpsAddress, setRpsAddress] = useState<string>();
  
  const loadCounterAddress = useCallback(async () => {
    try {
      const counter = await import(`@starknet-bootcamp/contracts/starknet-deployments/${network}/Counter.json`);
      setCounterAddress(counter.address);
    } catch (e) {
      console.log(e);
    }
  }, [setCounterAddress, network]);
  const loadRpsAddress = useCallback(async () => {
    try {
      // const rps = await import(`@starknet-bootcamp/contracts/starknet-deployments/${network}/RockPaperScissors.json`);
      //setRpsAddress(rps.address);
      setRpsAddress("0x02607d407c9ab49109d3dca6e25c0d09c2858d48e1f50c54e943e164327c985f");
    } catch (e) {
      console.log(e);
    }
  }, [setRpsAddress, network]);
  
  useEffect(() => {
    loadCounterAddress();
    loadRpsAddress();
  }, [loadCounterAddress, loadRpsAddress]);
  return [counterAddress, rpsAddress] as const;
}

export default getContractsAddresses;
