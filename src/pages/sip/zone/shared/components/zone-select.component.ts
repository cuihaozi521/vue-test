import { SipHelper, SipInject, SipLibMixin, SipModelComponent, SipVueComponent, SipVueProp, SipVueWatch } from '@libs/sip';
import _ from 'lodash';
import { ZoneModel } from '../models/zone.model';
import { ZoneService } from '../services/zone.service';

@SipVueComponent({
    mixins: [SipLibMixin]
})
export default class ZoneSelectComponent extends SipModelComponent {

    @SipVueProp(Boolean)
    autoSelect: boolean;

    @SipVueProp(String)
    regionId: string;

    @SipVueProp(Array)
    zoneCodes: Array<string>;

    @SipInject(ZoneService)
    zoneSrv:ZoneService;

    _allList:ZoneModel[] = [];
    list:ZoneModel[] = [];

    @SipVueWatch('regionId')
    private _watchRegion(value) {
        this._loadData();
    }
    @SipVueWatch('zoneCodes')
    private _watchZonecode(value) {
        this._filterDatas();
    }
    @SipVueWatch('$value')
    private _watchValue(value) {
        this.$emit('on-change');
    }

    private _loadData(){
        let regionId = this.regionId;
        if (!regionId){
            this._allList = [];
            this._filterDatas();
            return;
        }
        this.zoneSrv.getRegionZoneDetail({regionId:regionId}).then((rs) => {
            let datas = rs.isSucc ? rs.data : [];
            this._allList = datas || [];
            this._filterDatas();
        });
    }

    private _filterDatas(){
        let allList = this._allList || [];
        let zoneCodes = this.zoneCodes;
        let list;
        if (zoneCodes){
            list = _.filter(allList, function(item:ZoneModel){
                return zoneCodes.indexOf(item.code) >= 0;
            });
        } else {
            list = allList;
        }
        this.list = list;
        let value = SipHelper.autoSelect(list, 'sipId', this.$value, this.autoSelect);
        // this.$logger.debug(this.regionId, value, list);
        this.$value = value;
    }

}