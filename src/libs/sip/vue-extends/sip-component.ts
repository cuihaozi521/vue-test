import Vue from "vue";
import { $SipVueGetParent } from "./decorators/sip-vue-parent";
import { SipInject, $SipInjector } from "./decorators/sip-inject";
import { SipVueRouter } from "./sip-vue-router";
import { SipHttpService } from "../services/sip-http.service";
import { SipType } from "../base/sip-type";

/**与vue交接 */
export class SipVue extends Vue {

    readonly $router: SipVueRouter;//VueRouter;
    readonly $isDestroyed = false;

    readonly data: void;
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

}

/**组件基础类 */
export class SipComponent extends SipVue {

    get $componet(): SipComponent {
        return this;
    };

    /**获取业务组件 */
    get $business(): SipBusinessComponent {
        let business = this instanceof SipBusinessComponent ? this : $SipVueGetParent(this, SipBusinessComponent);
        return business;
    }

    $injector<T>(token: SipType<T>): T {
        return $SipInjector(this, token);
    }

}

/**业务组件基础类 */
export class SipBusinessComponent extends SipComponent {

}