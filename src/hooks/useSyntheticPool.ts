import useDiamondHand from './useDiamondHand';

const useSyntheticPool = (address: string) => {
  const diamondHand = useDiamondHand();
  return address ? diamondHand?.getPool(address) : null;
};

export default useSyntheticPool;
