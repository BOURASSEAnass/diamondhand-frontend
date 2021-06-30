import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import Number from 'src/components/Number';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useCollectSyntheticRedemption from 'src/hooks/useCollectSyntheticRedemption';
import Spacer from 'src/components/Spacer';
import SyntheticPool from 'src/diamondhand/SyntheticPool';
import SyntheticToken from 'src/diamondhand/SyntheticToken';
import useUnclaimedSynthetic from 'src/hooks/useUnclaimedSynthetic';

interface CollectRedemptionProps {
  pool: SyntheticPool;
  collateral: SyntheticToken;
}

const CollectRedemption: React.FC<CollectRedemptionProps> = ({ pool, collateral }) => {
  const { unclaimedCollateral, unclaimedShare } = useUnclaimedSynthetic(pool);
  const [, setRedemptionRequested] = useState(false);
  const diamondHand = useDiamondHand();
  const collectRedemption = useCollectSyntheticRedemption(pool, collateral);
  const onCollectRedemption = useCallback(() => {
    collectRedemption(unclaimedCollateral, unclaimedShare).then(() => {
      setRedemptionRequested(true);
    });
  }, [collectRedemption, unclaimedCollateral, unclaimedShare]);

  const hasUnclaimedCollateral = useMemo(() => {
    return unclaimedCollateral && unclaimedCollateral.gt(0);
  }, [unclaimedCollateral]);

  const hasUnclaimedShare = useMemo(() => {
    return unclaimedShare && unclaimedShare.gt(0);
  }, [unclaimedShare]);

  return pool && (hasUnclaimedCollateral || hasUnclaimedShare) ? (
    <>
      <Container>
        <Header>Collect redemption</Header>
        <UnclaimedContainer>
          <UnclaimedItem>
            <UnclaimedValue disabled={!hasUnclaimedCollateral}>
              <Number
                value={unclaimedCollateral}
                decimals={collateral?.decimals}
                precision={6}
              />
            </UnclaimedValue>
            <UnclaimedTitle>{collateral?.symbol}</UnclaimedTitle>
          </UnclaimedItem>

          <UnclaimedItem>
            <UnclaimedValue disabled={!hasUnclaimedShare}>
              <Number
                value={unclaimedShare}
                decimals={diamondHand.DIAMOND.decimals}
                precision={6}
              />
            </UnclaimedValue>
            <UnclaimedTitle>{diamondHand.DIAMOND.symbol}</UnclaimedTitle>
          </UnclaimedItem>
          <ButtonOutlineAction onClick={onCollectRedemption}>Collect</ButtonOutlineAction>
        </UnclaimedContainer>
      </Container>
      <Spacer />
    </>
  ) : null;
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.color.orange[300]};
  margin-top: 30px;
  padding: 10px 20px;
  border: ${({ theme }) => `3px solid ${theme.color.primary.main}`};
`;

const Header = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.color.primary.main};
  font-weight: 500;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
`;

const ButtonOutlineAction = styled.button`
  border: solid 3px ${({ theme }) => theme.color.primary.main};
  background: ${({ theme }) => theme.color.orange[500]};
  text-decoration: underline;
  margin-left: auto;
  cursor: pointer;
  padding: 5px 10px;
  text-decoration: none;
  margin: 0px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.main};
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: bold;
  &:hover {
    background: ${({ theme }) => theme.color.green[100]};
  }
`;

const UnclaimedContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UnclaimedItem = styled.div`
  flex: 50%;
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const UnclaimedTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => props.theme.color.grey[750]};
`;

const UnclaimedValue = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  background-color: transparent;
  font-weight: 600;
  font-size: 16px;
  margin-right: 5px;
  color: ${(props) =>
    props.disabled ? props.theme.color.grey[500] : props.theme.color.primary.main};
`;

export default CollectRedemption;
