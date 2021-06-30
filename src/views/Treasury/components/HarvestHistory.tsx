import React from 'react';
import { useGetHarvestLog } from 'src/api/backend-api';
import Number from 'src/components/Number';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import usePagingTable from 'src/hooks/usePagingTable';
import { formatSecs } from 'src/utils/formatTime';
import styled from 'styled-components';
import { LoadingLogo } from 'src/components/Loading/LoadingLogo';

interface HarvestHistoryProps {
  asset: string;
  symbol: string;
}

const HarvestHistory: React.FC<HarvestHistoryProps> = ({ asset, symbol }) => {
  const getHarvestLog = useGetHarvestLog(asset);
  const { data, isLoading, next, previous, isEndOfList, skip } = usePagingTable(
    getHarvestLog,
    5,
  );
  const config = useConfiguration();

  return (
    <StyledHistory loading={isLoading}>
      {isLoading && (
        <LoaderContainer>
          <LoadingLogo />
        </LoaderContainer>
      )}
      <StyledContent>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Capital</th>
              <th>Profit</th>
              <th>Reinvested</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map(
              (log, index) =>
                log?.amount !== '0' && (
                  <tr key={index}>
                    <td>{formatSecs(log.timestamp)}</td>
                    <td>
                      <Number value={log.amount} decimals={18} precision={4} /> {symbol}
                    </td>
                    <td>
                      <Number value={log.profit} decimals={18} precision={4} /> {symbol}
                    </td>
                    <td>
                      <Number value={log.enter} decimals={18} precision={4} /> {symbol}
                    </td>
                    <td>
                      <a
                        href={`${config.etherscanUrl}/tx/${log.transactionHash}`}
                        target="_blank"
                      >
                        {log.transactionHash}
                      </a>
                    </td>
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </StyledContent>
      <StyledGroupButton>
        {skip > 0 && <StyledButton onClick={previous}>newer</StyledButton>}
        {!isEndOfList && <StyledButton onClick={next}>older</StyledButton>}
      </StyledGroupButton>
    </StyledHistory>
  );
};

export const StyledHistory = styled.div<{ loading?: boolean }>`
  position: relative;
  padding: 10px 22px 10px 22px;
  min-height: ${({ loading }) => (loading ? '250px' : 'auto')};
`;

const StyledContent = styled.div`
  font-size: 13px;
  table {
    width: 100%;
    margin-top: 10px;
    tr {
      td {
        padding: 10px 10px 10px 0px;
        width: 20%;
        a {
          text-decoration: none;
          color: #fea430;
          :hover {
            text-decoration: underline;
          }
        }
      }
      th {
        padding: 0px;
        font-size: 16px;
        font-weight: bold;
        color: ${({ theme }) => theme.color.primary.main};
      }
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xxl}) {
    overflow-x: scroll;
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #86e3ff99;
  font-size: 1.6rem;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
`;

export const StyledGroupButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const StyledButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export default HarvestHistory;
