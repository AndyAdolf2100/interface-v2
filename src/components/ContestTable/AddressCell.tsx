import React, { useCallback, useEffect, useState } from 'react';
import { useActiveWeb3React } from 'hooks';
import { getEtherscanLink, shortenAddress } from 'utils';

type Props = {
  address: string;
  displayShortened?: boolean;
  lensHandle?: string;
};

function AddressCell({ address, displayShortened = false, lensHandle }: Props) {
  const { chainId, library } = useActiveWeb3React();
  const [ENSName, setENSName] = useState<string | null>(null);

  const ensResolver = useCallback(async () => {
    if (!library) return;
    try {
      const name = await library.lookupAddress(address);
      setENSName(name);
    } catch (error) {
      console.error('Error while resolving ens name', error);
    }
  }, [address, library]);

  useEffect(() => {
    ensResolver();
  }, [ensResolver]);

  if (!chainId) return <></>;

  const getDisplayText = () => {
    let text = ENSName || lensHandle;
    if (!text) text = displayShortened ? shortenAddress(address) : address;
    return text;
  };

  return (
    <a
      href={getEtherscanLink(chainId, address, 'address')}
      target='_blank'
      rel='noopener noreferrer'
      className='text-primaryText no-decoration'
      style={{ width: '48%', textDecoration: 'none' }}
    >
      <small>{getDisplayText()}</small>
    </a>
  );
}

export default AddressCell;
