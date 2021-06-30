import useDiamondHand from 'src/hooks/useDiamondHand';

export const useFoundry = (address: string) => {
  const diamondHand = useDiamondHand();
  return address ? diamondHand?.getFoundry(address) : null;
};
