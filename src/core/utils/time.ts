/*
 * Description  : 时间工具
 * Author       : lichnow
 * Homepage     : https://gkr.io
 * My Blog      : https://lichnow.com
 * Date         : 2020-03-06 13:52:18 +0800
 * LastEditTime : 2020-10-25 23:46:45 +0800
 * Licensed     : MIT
 */

import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { TimeOptions } from '../interface';
import { BaseUtil, IConfigMaps } from './base';

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(dayOfYear);

/**
 * 时间类只是day.js库的代理类,用户生产新的day.js对象
 *
 * @export
 * @class Timer
 */
export class Time extends BaseUtil<{ locale: string; timezone: string }> {
    protected configMaps: IConfigMaps = {
        required: true,
        maps: { timezone: 'app.timezone', locale: 'app.locale' },
    };

    create(config: { locale: string; timezone: string }) {
        this.config = config;
    }

    /**
     * 传入配置,获取时间
     * language不设置则为全局配置的语言
     * zoneTime不设置则为全局配置的时区
     * 其它方法与day.js一样
     *
     * @param {TimeOptions} [options={}]
     * @returns {dayjs.Dayjs}
     * @memberof Time
     */
    getTime(options?: TimeOptions): dayjs.Dayjs {
        if (!options) return dayjs();
        const { date, format, locale, strict, zonetime } = options;
        // 每次创建一个新的时间对象
        // 如果没有传入local或timezone则使用应用配置
        const now = dayjs(
            date,
            format,
            locale ?? this.config.locale,
            strict,
        ).clone();
        return now.tz(zonetime ?? this.config.timezone);
    }
}
