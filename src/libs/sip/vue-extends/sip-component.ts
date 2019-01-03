import _ from "lodash";
import Vue from "vue";
import { SipHelper } from '../base/sip-helper';
import { SipType } from "../base/sip-type";
import { SipContextmenuItem } from "../components/contextmenu/sip-contextmenu-item";
import { SipHttpService } from "../http/sip-http.service";
import { SipLoggerService } from '../logger/sip-logger.service';
import { SipConfig } from '../sip-config';
import { $SipInjector, $SipInjectorClear } from "./decorators/sip-inject";
import { SipVueBeforeDestroy, SipVueCreated, SipVueDestroyed, SipVueMounted } from './decorators/sip-vue-lifecycle';
import { SipVueProp, SipVueWatch } from "./decorators/sip-vue-property-decorator";
import { SipAccessManager } from "./sip-access";
import { SipUiLink } from "./sip-ui-link";
import { SipVueCurrentRoute } from './sip-vue-current-route';
import { SipVueRouter } from "./sip-vue-router";

let undef;

function _getComponentParent<T=any>(component: Vue, componentClass: SipType<T>): T {
    if (!component) return undef;
    let parent = component.$parent;
    return parent ? (parent instanceof componentClass ? parent : _getComponentParent(parent, componentClass)) : undef;
}

export function SipClosestComponent<T=any>(owner: any, componentClass: SipType<T>): T {
    return owner instanceof componentClass ? owner : (_getComponentParent(owner, componentClass) as any);
}

/**与vue交接 */
export class SipVue extends Vue {

    readonly $router: SipVueRouter;//VueRouter;

    get $currentRoute(): SipVueCurrentRoute {
        return this['$route'];
    }

    get $vueName(): string {
        let vnode: any = this.$vnode;
        return vnode && vnode.componentOptions ? vnode.componentOptions.Ctor.options.name : '';
    }

    readonly data11: void;
    readonly props: void;
    readonly store: void;

    readonly beforeCreate: void;
    readonly created: void;
    readonly beforeMount: void;
    readonly mounted: void;
    readonly beforeDestroy: void;
    readonly destroyed: void;
    readonly beforeUpdate: void;
    readonly updated: void;
    readonly activated: void;
    readonly deactivated: void;
    readonly computed: void;

}

/**组件基础类 */
export class SipComponent extends SipVue {

    readonly $isDestroyed = false;
    readonly $isInited = false;
    readonly $isReady = false;

    get $labelWidth(): number { return SipConfig.form.labelWidth; }

    get $component(): SipComponent {
        return this;
    };

    /**获取业务组件 */
    get $business(): SipBusinessComponent {
        return this.$injector(SipBusinessComponent);
    }

    $closest<T=any>(componentClass: SipType<T>): T {
        return SipClosestComponent(this, componentClass);
    }

    $isComponentClass(componentClass: SipType) {
        return SipHelper.isClass(componentClass, SipComponent);
    }

    $injector<T>(token: SipType<T>): T {
        return $SipInjector(this, token);
    }

    get $http(): SipHttpService {
        return this.$injector(SipHttpService);
    };

    get $logger(): SipLoggerService {
        return this.$injector(SipLoggerService);
    };

    $open(path: string, query?: any, params?: any): SipUiLink {
        let business = this.$business;
        if (business)
            return business.$open.apply(business, arguments);
        else {
            /**在navbar时没有business */
            let root: any = this.$root;
            root.$sipHome && root.$sipHome.sipOpen(this.$vueName, path, query, params, false);
        }
    }

    $send(...args: any[]) {
        this.$business && this.$business.$send(...args);
    }

    $close(...args: any[]) {
        this.$business && this.$business.$close(...args);
    }

    $showContextMenu(e: MouseEvent, items: SipContextmenuItem[]): boolean {
        let root: any = this.$root;
        return root.$sipHome && root.$sipHome.sipShowContextMenu(e, items);
    }

    //#region sipEvents

    $onDestroyed(fn: () => void) {
        if (this.$isDestroyed) return fn();
        this.$once('onDestroyed', fn);
    }

    $onInit(fn: () => void) {
        if (this.$isInited) return fn();
        this.$once('onInit', fn);
    }

    $onReady(fn: () => void) {
        if (this.$isReady) return fn();
        this.$once('onReady', fn);
    }

    @SipVueBeforeDestroy()
    private _sip_comp_befordestroyed() {
        this.$emit('onDestroyed');
    }

    /**保留 */
    @SipVueDestroyed()
    private _sip_comp_destroyed() {
        $SipInjectorClear(this);
        this._$accessManager = null;
        let _this: any = this;
        _this.$isDestroyed = true;
        this.$off();
    }

    @SipVueCreated()
    private _sip_comp_create() {

    }

    @SipVueMounted()
    private _sip_comp_monuted() {

    }

    // @SipInit()
    // private _sip_comp_init() {

    // }

    // @SipReady()
    // private _sip_comp_ready() {

    // }

    //#endregion sipEvents

    private _$accessManager: SipAccessManager;
    get $accessManager(): SipAccessManager {
        return this._$accessManager || (this._$accessManager = new SipAccessManager(this))
    }

}

//#region SipModelComponent

function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        const name = child.$options.name;

        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            // todo 如果 params 是空数组，接收到的会是 undefined
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}

export class SipModelComponent extends SipComponent {

    @SipVueProp([String, Number, Boolean, Array])
    private value: string;

    /** 获取或设置值 */
    get $value(): any {
        return this.value;
    }

    set $value(value: any) {
        this.$emit('input', value);
    }

    @SipVueWatch('$value')
    private _sip_model_change(value) {
        this.$dispatch('FormItem', 'on-form-change', value);
    }

    /**
     * 指定父组件发事件
     * @param componentName 组件名称
     * @param eventName 事件名称
     * @param params 
     */
    $dispatch(componentName: string, eventName: string, params: any[]) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;

        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;

            if (parent) {
                name = parent.$options.name;
            }
        }
        if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params));
        }
    }

    /**
     * 指定子组件广播
     * @param componentName 组件名称
     * @param eventName 事件名称
     * @param params 参数
     */
    $broadcast(componentName: string, eventName: string, params: any[]) {
        broadcast.call(this, componentName, eventName, params);
    }

}

//#endregion SipModelComponent

export interface SipUiOpenOption {
    params?: any;
    query?: any;
    type?: 'page' | 'iframe' | 'modal';
    opener?: any;
}

/**业务组件基础类 */
export class SipBusinessComponent extends SipComponent {

    get $business(): SipBusinessComponent {
        return this;
    }

    $params<T=any>(defaultValue?: T): T {
        let route = this.$currentRoute;
        return _.cloneDeep(Object.assign({}, defaultValue, route.params, route.query));
    }

    $uiLink: SipUiLink;

    get $page(): SipBusinessComponent {
        return this.$uiLink && this.$uiLink.page;
    }

    get $opener(): SipBusinessComponent {
        return this.$uiLink && this.$uiLink.opener;
    }

    $open(path: string, query?: any, options?: SipUiOpenOption): SipUiLink {
        return new SipUiLink(this);
    }

    $send(...args: any[]) {
    }

    $close(...args: any[]) {
    }

    $modal(path: string, params?: any, option?: SipUiOpenOption): SipUiLink {
        return new SipUiLink(this);
    }

}