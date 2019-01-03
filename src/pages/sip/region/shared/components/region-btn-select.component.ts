import { SipHelper, SipInject, SipLibMixin, SipModelComponent, SipReady, SipVueComponent, SipVueProp, SipVueWatch } from '@libs/sip';
import emitter from 'iview';
import _ from "lodash";
import { RegionModel } from "../models/region.model";
import { RegionService } from "../services/region.service";
console.log('emitter', emitter);

@SipVueComponent({
    mixins: [SipLibMixin]
})
export default class RegionBtnSelectComponent extends SipModelComponent {

    @SipVueProp(Boolean)
    autoSelect: boolean;

    @SipVueProp(Array)
    regionIds: string[];

    @SipInject(RegionService)
    regionSrv: RegionService;

    get current(): RegionModel {
        let region: any = _.find(this.regionList, { regionId: this.$value });
        return region;
    }

    @SipVueWatch('$value')
    private _watchValue(p) {
        this.$emit('on-change', this.current);
    }

    _allList: RegionModel[] = [];
    regionList: RegionModel[] = [];

    loading = true;

    @SipReady()
    private _ready() {
        let regionList = this.regionSrv.regionList || [];
        this._allList = _.cloneDeep(regionList).map(function (item) { item._isSelected = false; return item; });
        this._filterRegions();
    }

    @SipVueWatch('regionIds')
    private _watchRegionId() {
        this._filterRegions();
    }

    private _filterRegions() {
        let regionList = this._allList || [];
        let regionIds = this.regionIds;
        if (regionIds) {
            regionList = _.filter(regionList, function (item) {
                return regionIds.indexOf(item.regionId) >= 0;
            });
        }
        this.regionList = regionList;
        this.loading = this.loading && regionList.length <= 0;
        let value = SipHelper.autoSelect(regionList, 'regionId', this.$value, this.autoSelect);
        this.select(value);
    }

    select(regionId: string) {
        this.regionList.forEach((item) => {
            item._isSelected = item.regionId == regionId;
            return item;
        });
        this.$value = regionId;
    }

    click(region: RegionModel) {
        if (region._isSelected) return;
        this.$value = region.regionId;
        region._isSelected = true;
        this.regionList.forEach(function (item) {
            if (item != region)
                item._isSelected = false;
        });
    }

}