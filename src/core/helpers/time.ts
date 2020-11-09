import dayjs from 'dayjs';
import { Gkr } from '../gkr';
import { TimeOptions } from '../interface';
import { Time } from '../utils';

const timer = () => Gkr.util.get(Time);
export function time(options?: TimeOptions): dayjs.Dayjs {
    return timer().getTime(options);
}
