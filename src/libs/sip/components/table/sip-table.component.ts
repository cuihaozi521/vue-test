import { Table } from '*.vue';
import _ from 'lodash';
import { SipVueDestroyed, SipVueRef } from '../../vue-extends';
import { SipVueMounted } from '../../vue-extends/decorators/sip-vue-lifecycle';
import { SipVueComponent, SipVueProp } from '../../vue-extends/decorators/sip-vue-property-decorator';
import { SipComponent } from '../../vue-extends/sip-component';
import { SipTableColumn } from './sip-table-column';
import { SipTableManager } from './sip-table.manager';

@SipVueComponent({})
export default class SipTableComponent extends SipComponent {

    @SipVueProp(Object)
    manager: SipTableManager;

    get datas(): any[] {
        return this.manager.datas;
    }

    get columns(): SipTableColumn[] {
        return this.manager.columns;
    }
    get loading(): boolean {
        return this.manager.loading;
    }

    
    public get pageIndex(): number {
        return this.manager.pageIndex;
    }

    public get pageSizeOpts(): number[] {
        return this.manager.pageSizeOpts;
    }

    public get pageSize(): number {
        return this.manager.pageSize;
    }

    public get total(): number {
        return this.manager.total;
    }

    pageChangePage(pageIndex){
        this.manager.pageIndex = pageIndex;
    }

    pageChangeSize(pageSize){
        if (pageSize == this.pageSize) return;
        this.manager.pageSize = pageSize;
    }


    @SipVueRef('table1')
    table: Table;

    private _getColumnSlotScopes(){
         let slots = {};
         _.forEach(this.$children, function(item:any){
           if (item.column && _.isFunction(item.$sipTableSlotScope)){
               slots[item.column] = item;
           }
         });
         return slots;
    }

    @SipVueMounted()
    private _sip_table_created(){
        this.manager._init(this.table, this._getColumnSlotScopes());
    }

    @SipVueDestroyed()
    private _sip_table_destroy() {
        this.manager.$destroy();
    }

}