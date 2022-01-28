import { useInstalled } from '@/hooks/installed';
const { skipped } = useInstalled();

import * as finder from './finder';
import * as finderMock from './finder-mock';

export default () => ({
    ...(skipped.value ? finderMock : finder)
});