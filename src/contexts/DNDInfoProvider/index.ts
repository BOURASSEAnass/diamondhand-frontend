import { useContext } from 'react';
import { Context } from './DNDInfoProvider';

export { DNDInfoProvider as default } from './DNDInfoProvider';

export const useDNDInfo = () => useContext(Context);
