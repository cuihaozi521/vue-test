import { SipHttpDef, SipHttpDefFunction, SipInjectable, SipService } from '@libs/sip';
import _ from 'lodash';
import { StorageModel } from '../models/storage.model';

@SipInjectable({ scope: 'business' })
export class StorageService extends SipService {

    @SipHttpDef<StorageModel[]>({
        url: 'api/vdc/getAvailableStorageByVdc',
        defMethod: 'get',
        cache: true,
        handle: function (rs) {
            if (rs.isSucc && rs.data)
                rs.data = _.each(rs.data, function (item) {
                    item.zoneCode && (item.zoneCodeList = item.zoneCode.split(','))
                });
            return rs;
        }
    })
    getAvailableStorageByVdc: SipHttpDefFunction<{
        vdcId?: string;
        useBy?: 'volume' | 'instance';
        computeScheduleTags?: string;
    }, StorageModel[]>;

    /**
     * 根据region 和 zone 获取 storages
     * @param storages 
     * @param regionId 
     * @param zoneCode 
     */
    getStorages(storages: StorageModel[], regionId?: string, zoneCode?: string) {
        let list = _.filter(storages, function (item) {
            return item.regionId == regionId
                && (!zoneCode || !item.zoneCode || item.zoneCode.indexOf(zoneCode) >= 0);
        });
        return list;
    }

    /**
     * 根据storage获取可用区, 返回null表示所有可用区
     * @param storages 
     */
    getZoneCodes(storages: StorageModel[]): string[] | null {
        let zoneCodes: string[] = [];
        let isAllZone = false;
        _.forEach(storages, function (item) {
            if (!item.zoneCode) {
                isAllZone = true;
            } else {
                zoneCodes = zoneCodes.concat(item.zoneCodeList);
            }
        });
        return isAllZone ? null : _.uniq(zoneCodes);
    }

}