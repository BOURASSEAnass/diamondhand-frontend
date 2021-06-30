import useDiamondHand from './useDiamondHand';

const useSyntheticToken = (address: string, symbol: string) => {
  const diamondHand = useDiamondHand();
  return address ? diamondHand?.getSynthetic(address, symbol) : null;
};

export default useSyntheticToken;
