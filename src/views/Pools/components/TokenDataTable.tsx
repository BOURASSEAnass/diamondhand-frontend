import React, { useMemo } from 'react';
import { useTokenInfo } from 'src/api/backend-api';
import Amount from 'src/components/Amount';
import { LoadingLogo } from 'src/components/Loading/LoadingLogo';
import NumberDisplay from 'src/components/Number';
import TokenSymbol from 'src/components/TokenSymbol';
import { useDNDInfo } from 'src/contexts/DNDInfoProvider';
import useDiamondHand from 'src/hooks/useDiamondHand';
import styled from 'styled-components';
import { PoolListItem } from '../hooks/useMulticallPoolInfo';

const TokenDataTable: React.FC<{ list: PoolListItem[] }> = ({ list }) => {
  const dh = useDiamondHand();
  const dndInfo = useDNDInfo();

  const tokens = useMemo(() => {
    if (!dh || !list?.length) {
      return [];
    }
    return list.map((t) => t.syntheticPoolInfo.syntheticSymbol);
  }, [dh, list]);

  const data = useTokenInfo(tokens);

  return (
    <StyledTable cellSpacing="0">
      <thead>
        <tr>
          <th>Token</th>
          <th>Price</th>
          <th>Supply</th>
          <th>M. Cap</th>
        </tr>
      </thead>
      <tbody>
        {!data || !dndInfo ? (
          <tr>
            <td colSpan={4}>
              <LoadingLogo width="50px" marginTop="0px" />
            </td>
          </tr>
        ) : (
          <>
            <tr>
              <td>
                <div className="symbol">
                  <TokenSymbol symbol="DND" size={32} />
                  <span>{'DND'}</span>
                </div>
              </td>
              <td>
                $
                <NumberDisplay value={dndInfo?.price} decimals={6} precision={2} />
              </td>
              <td>
                <NumberDisplay value={dndInfo?.totalSupply} decimals={18} precision={2} />
              </td>
              <td>
                $
                <Amount value={dndInfo?.marketCap} decimals={6} precision={2} />
              </td>
            </tr>
            {data?.map((item) => (
              <tr key={item.symbol}>
                <td>
                  <div className="symbol">
                    <TokenSymbol symbol={item.symbol} size={32} />
                    <span>{item.symbol}</span>
                  </div>
                </td>
                <td>
                  $
                  <NumberDisplay
                    value={item.price}
                    decimals={6}
                    precision={2}
                    keepZeros={true}
                  />
                </td>
                <td>
                  <NumberDisplay value={item?.totalSupply} decimals={18} precision={2} />
                </td>
                <td>
                  $
                  <Amount value={item.marketCap} decimals={6} precision={2} />
                </td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </StyledTable>
  );
};

const StyledTable = styled.table`
  width: 100%;
  height: 100%;
  border: none;

  thead {
    th {
      top: 0;
      position: sticky;
      padding: 13px 5px;
      background-color: #86e3ff;
      border-bottom: solid 3px ${(p) => p.theme.color.primary.main};
      @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
        padding: 13px 10px;
      }
    }
  }
  tbody {
    background-color: #e7faff;
    border-bottom: solid 3px ${(p) => p.theme.color.primary.main};
    td {
      border-bottom: solid 1px ${(p) => `${p.theme.color.primary.main}33`};
      padding: 5px;
      @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
        padding: 10px;
      }
      .symbol {
        color: #a89dff;
        font-weight: 700;
        display: flex;
        align-items: center;
        img {
          margin-right: 10px;
        }
        span {
          display: none;
        }
      }
    }
    tr:last-child {
      tr {
        border-bottom: none;
      }
    }
  }
`;

export default TokenDataTable;
