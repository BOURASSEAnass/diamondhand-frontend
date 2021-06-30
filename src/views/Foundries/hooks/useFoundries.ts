import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';

export const useFoundries = () => {
  const configuration = useConfiguration();
  const foundries =
    configuration.pools
      ?.filter((p) => !!p.foundry)
      .map((p) => {
        return {
          address: p.foundry,
          collateralSymbol: p.collateralSymbol,
          syntheticSymbol: p.syntheticSymbol,
        };
      }) || [];
  return foundries;
};
