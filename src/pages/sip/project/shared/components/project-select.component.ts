import { SipHelper, SipInject, SipLibMixin, SipModelComponent, SipVueComponent, SipVueMounted, SipVueProp, SipVueWatch } from '@libs/sip';
import _ from "lodash";
import { ProjectSimpleModel } from "../models/project-simple.model";
import { ProjectService } from '../services/project.service';

@SipVueComponent({
    mixins: [SipLibMixin]
})
export default class ProjectSelectComponent extends SipModelComponent {

    @SipVueProp(Boolean)
    autoSelect: boolean;

    loading1 = true;

    @SipInject(ProjectService)
    projectSrv: ProjectService;

    private _allList: ProjectSimpleModel[] = [];
    projectList: ProjectSimpleModel[] = [];

    @SipVueWatch('$value', { immediate: true, deep: false })
    private _watchValue(p) {
        this._emitChange();
    }

    private _emitChange() {
        let current = this.current;
        this._makeRegionIds(current);
        this.$emit('on-change', current);
    }

    get current(): ProjectSimpleModel {
        let project: ProjectSimpleModel = _.find(this.projectList, { projectId: this.$value as string });
        return project;
    }

    regionIds: string[] = [];
    private _makeRegionIds(current: ProjectSimpleModel) {
        let regions = current ? current.regions : null;
        let regionIds = (regions || []).map(function (item) { return item.regionId; });
        this.regionIds = regionIds;
    }

    @SipVueMounted()
    private _init1() {
        this.projectSrv.getSimpleProjectInfo({ userMode: 'buy', showRegion: true }).then((rs) => {
            let projectList = rs.isSucc ? rs.data : [];
            this._allList = projectList || [];
            let value = SipHelper.autoSelect(this._allList, 'projectId', this.$value, this.autoSelect);
            this.$value = value;
            this.query();
            this.loading1 = false;
        });
    }

    query(query?: string) {
        let reg = !query ? /.*/i : new RegExp(_.escapeRegExp(query), 'i');
        let projectList = !this._allList ? [] : this._allList.filter((item) => {
            return reg.test(item.projectName)
        });
        this.projectList = projectList;
    }

    debounceQuery = _.debounce((query?: string) => {
        this.query(query);
    }, 200);


    queryChange(query: string) {
        this.debounceQuery(query);
    }

    change(value: string) {
        this.$value = value;
        setTimeout(() => this.debounceQuery(''), 1);
    }

}