import { SipHelper, SipInject, SipLibMixin, SipModelComponent, SipVueComponent, SipVueProp, SipVueWatch } from '@libs/sip';
import _ from 'lodash';
import { StorageModel } from '../models/storage.model';
import { StorageService } from '../services/storage.service';

@SipVueComponent({
    mixins: [SipLibMixin]
})
export default class StorageSelectComponent extends SipModelComponent {

    @SipVueProp(Boolean)
    autoSelect: boolean;

    @SipVueProp(String)
    useby: string;

    @SipVueProp(String)
    vdcId: string;

    @SipVueProp(String)
    regionId: string;

    @SipVueProp(String)
    zoneCode: string;

    /** 可用区 */
    canUseZonecodes:string[] | null = null;

    private _allList: StorageModel[] = [];
    list: StorageModel[] = [];
    get current(): StorageModel {
        let item: any = _.find(this.list, { storageId: this.$value });
        return item;
    }
    @SipVueWatch('$value')
    private _watchValue(p) {
        this.$emit('on-change', this.current);
    }

    @SipInject(StorageService)
    private _storageSrv: StorageService;

    @SipVueWatch('vdcId')
    private _watchVdc(value) {
        this._loadData();
    }

    private _loadData() {
        let vdcId = this.vdcId;
        let useby: any = this.useby || 'instance';
        this._storageSrv.getAvailableStorageByVdc({ vdcId: vdcId, useBy: useby }).then((rs) => {
            this._allList = rs.isSucc ? (rs.data || []) : [];
            this._filterDatas();
        });
    }
    @SipVueWatch('regionId')
    private _watchRegion(value) {
        this._filterDatas();
    }
    @SipVueWatch('zoneCode')
    private _watchZone(value) {
        this._filterDatas();
    }

    private _filterDatas() {
        let allList = this._allList || [];
        let list = this._storageSrv.getStorages(allList.slice(), this.regionId, this.zoneCode);
        this.list = list;
        let value = SipHelper.autoSelect(list, 'storageId', this.$value, this.autoSelect);
        this.$value = value;
        this.canUseZonecodes = this._storageSrv.getZoneCodes(this.list);

    }

}