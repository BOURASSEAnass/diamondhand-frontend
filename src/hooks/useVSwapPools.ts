import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetVFarmPoolInfo } from 'src/api/backend-api';
import { VSwapUnverifiedPoolData } from 'src/api/models';
import useInterval from './useInterval';

const pools = [
  '0xd1d9dcc9d15d20e47c5d2941a53e192608cb3e30',
  '0x15d314027ea26ea83c3d8a9619a797a5c7c85a96',
  '0x989ef4a5e2e82349b7cb5064981cd0c29efda542',
  '0x4564a2ec4454dd5d8fd840e426a49a78f9f17f35',
  '0x5f66c3fed3546c4bc2bfc12f5a4dbffcb7b59019',
];

const useVSwapPools = () => {
  const fetchPoolInfo = useGetVFarmPoolInfo();
  const [data, setData] = useState<VSwapUnverifiedPoolData[]>([]);
  const [tvl, setTvl] = useState(0);
  const [refreshTime, setRefreshTime] = useState(0);

  useEffect(() => {
    setRefreshTime(300000);
    return () => {
      setRefreshTime(0);
    };
  }, []);

  const fetch = useCallback(() => {
    fetchPoolInfo().then((poolInfo) => {
      setData(poolInfo?.data || []);
      const _poolDatas = (poolInfo?.data || []).filter(
        (t: VSwapUnverifiedPoolData) => pools.indexOf(t.contractAddress) > -1,
      );
      let _tvl = 0;
      (_poolDatas || []).forEach((t: VSwapUnverifiedPoolData) => {
        _tvl += t.totalSupplyUSD;
      });
      setTvl(_tvl);
    });
  }, [fetchPoolInfo]);

  const getPoolData = (poolAddress: string) => {
    return (data || []).filter((t) => t.contractAddress === poolAddress)[0];
  };

  const diamondPools = useMemo(() => {
    return pools.map((p) => data.filter((t) => p === t.contractAddress)[0]).filter((t) => !!t);
  }, [data]);

  useInterval(fetch, refreshTime);

  return { diamondPools, pools, tvl, getPoolData };
};

export default useVSwapPools;
