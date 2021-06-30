import { useState, useCallback, useEffect } from 'react';
import useInterval from 'src/hooks/useInterval';
import styled from 'styled-components';

export const ProgressBar: React.FC<{ to: Date; length: number }> = ({ to, length }) => {
  const [width, setWidth] = useState('0%');

  const update = useCallback(() => {
    if (length && to) {
      const now = new Date();
      const value = to < now ? 100 : (length * 1000 - +to + +now) / 10 / length;
      setWidth(value.toFixed(2) + '%');
    }
  }, [length, to]);

  useEffect(() => update(), [update]);
  useInterval(update, length / 100);

  return (
    <StyledProgressTrack>
      <StyledProgressBar style={{ width }} />
    </StyledProgressTrack>
  );
};

const StyledProgressTrack = styled.div`
  margin-top: 8px;
  height: 10px;
  width: 100%;
  border: solid 1px ${({ theme }) => theme.color.orange[500]};
  position: relative;
`;

const StyledProgressBar = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.color.orange[500]};
  height: 100%;
`;
