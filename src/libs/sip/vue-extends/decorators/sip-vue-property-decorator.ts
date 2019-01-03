import _ from 'lodash';
import Vue, { ComponentOptions, PropOptions, WatchOptions } from 'vue';
import Component from 'vue-class-component';
import { VueClass } from 'vue-class-component/lib/declarations';
import { Constructor, Inject, Provide } from 'vue-property-decorator';
import { Action, Getter, Mutation, State } from 'vuex-class';
//https://github.com/vuejs/vue-class-component

//https://github.com/kaorun343/vue-property-decorator

export type SipMixin = ComponentOptions<Vue> | typeof Vue;

export interface SipVueComponentOptions<V extends Vue> extends ComponentOptions<V> {
}

function _makeMixins(mixins, outMixns: any[]) {
    _.each(mixins, function (item) {
        outMixns.push(item);
        if (item.mixins) {
            _makeMixins(item.mixins.slice().reverse(), outMixns);
        }
    });
}

function _mergeMixins(mixins: any[]): any[] {
    let outMixns = [];
    _makeMixins(mixins.slice().reverse(), outMixns);
    outMixns = _.uniq(_.reverse(outMixns));
    outMixns = _.map(outMixns, function (item) {
        return _.assign({}, item, { mixins: null });
    });
    return outMixns;
}

export function SipVueComponent<V extends Vue>(options: SipVueComponentOptions<V> & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC {
    return function (target: Function) {
        let prototype = target.prototype;
        options.mixins = (prototype._sip_mixins || []).concat(options.mixins || []);
        let outMixins = _mergeMixins(options.mixins);
        // console.log('mixins', options.mixins, outMixins);
        options.mixins = outMixins;
        let componentFactory: any = Component(options);
        return componentFactory(target);
    };
    // return Component(options);
}

// export const SipVueComponent = Component;

export function SipGetMixins<V extends Vue>(target: any): SipVueComponentOptions<V>[] {
    return target._sip_mixins = (target._sip_mixins || []).slice();
}

let _lastTarget;
export function SipMixinLife(target: any, mixinkey: string, fn: Function) {
    let mixins = SipGetMixins(target);
    let newMixin: any = Object.create(null);
    newMixin[mixinkey] = function () {
        let a = mixins;
        fn.apply(this, arguments);
    };
    if (_lastTarget !== target) {
        mixins.push(newMixin);
        _lastTarget = target;
    }
    else {
        let len = mixins.length;
        if (len > 0) {
            let endMixin = mixins[len - 1];
            if (endMixin[mixinkey])
                mixins.push(newMixin);
            else
                Object.assign(endMixin, newMixin);
        } else
            mixins.push(newMixin);
    }
}

function _newMixinObject(mixinkey: string, propKey: string, options: any) {
    let newMixin = Object.create(null);
    if (!propKey) {
        newMixin[mixinkey] = options;
    } else {
        newMixin[mixinkey] = Object.create(null);
        newMixin[mixinkey][propKey] = options;
    }
    return newMixin;
}

function _hasMixinProp(mixin: any, mixinkey: string, propKey: string): boolean {
    return !!(mixin[mixinkey] && mixin[mixinkey][propKey]);
    // if (!propKey) {
    //     return !!mixin[mixinkey];
    // } else {
    //     if (!_hasMixinProp(mixin, mixinkey))
    //         return false;
    //     else {
    //         return !!mixin[mixinkey][propKey];
    //     }
    // }
}

export function SipMixinExtendObject(target: any, mixinkey: string, propKey: string, options: any) {
    let mixins = SipGetMixins(target);
    let len = mixins.length;
    let newMixin = _newMixinObject(mixinkey, propKey, options);

    if (len == 0 || _lastTarget !== target) {
        mixins.push(newMixin);
        _lastTarget = target;
    } else {
        let endMixin = mixins[len - 1];
        if (propKey && _hasMixinProp(endMixin, mixinkey, propKey))
            mixins.push(newMixin);
        else if (endMixin[mixinkey])
            Object.assign(endMixin[mixinkey], newMixin[mixinkey]);
        else
            Object.assign(endMixin, newMixin);
    }
}

export function SipVueProp(options?: (PropOptions | Constructor[] | Constructor)): PropertyDecorator {
    return function (target: any, propKey: string) {
        SipMixinExtendObject(target, 'props', propKey, options);
    };
}

export function SipVueModel(event: string = 'change', options?: (PropOptions | Constructor[] | Constructor)): PropertyDecorator {
    return function (target: any, propKey: string) {
        SipMixinExtendObject(target, 'props', propKey, options);
        SipMixinExtendObject(target, 'model', null, { prop: propKey, event: event });
    };
}

function _getWatchPath(target: any, propKey: string, path: any): string {
    if (_.isFunction(path)) {
        let key = ['_sip_watch_computed', propKey].join('_');
        SipMixinExtendObject(target, 'computed', key, { get:function () {
            return path.apply(this, arguments);
        }});
        return key;
    } else {
        return path;
    }
}

export function SipVueWatch(path: string | string[] | (() => any), options?: WatchOptions): MethodDecorator {
    const { deep = false, immediate = false } = options || {};
    return function (target: any, propKey: string) {
        if (!_.isArray(path))
            SipMixinExtendObject(target, 'watch', _getWatchPath(target, propKey, path), { handler: target[propKey], deep, immediate });
        else {
            _.forEach(path, function (item, idx) {
                let key = ['_sip_watch_val', propKey].join('_')
                let keyOld = ['_sip_watch_oldval', propKey].join('_')
                SipMixinExtendObject(target, 'watch', _getWatchPath(target, propKey, item), {
                    handler: function (val, oldVal) {
                        let vals = (this[key] || (this[key] = []));
                        let valOlds = (this[keyOld] || (this[keyOld] = []));
                        vals[idx] = val;
                        valOlds[idx] = oldVal;
                        target[propKey].call(this, vals, valOlds);
                    }, deep, immediate
                });
            });
        }
    };
}


/**使用typescript的get set代替 */
// export function SipVueComputed(): PropertyDecorator {
//     return createDecorator(function(componentOptions, k) {
//         console.log('SipVueComputed', arguments);
//       (componentOptions.computed || (componentOptions.computed = {}) as any)[k] ={ get: function(){ return this[k].apply(this, arguments);} , set:function(){} }
//     })
//   }


/**
 * 
 * @param event 事件名称
 * @param el 是否绑定到el
 */
export function SipVueEvent(event: string, once: boolean = false, el: boolean = false): PropertyDecorator {
    let eventFnKey = ['_sip_vue_on', event].join('_');
    return function (target: any, propKey: string) {
        if (!el) {
            SipMixinLife(target, 'created', function () {
                let fn = function () {
                    target[propKey].apply(this, arguments);
                }.bind(this);
                this[once ? '$once' : '$on'](event, fn);
            });
        } else {
            SipMixinLife(target, 'mounted', function () {
                let fn = function () {
                    target[propKey].apply(this, arguments);
                }.bind(this);
                (this[eventFnKey] || (this[eventFnKey] = [])).push(fn);
                this.$el.addEventListener(event, fn);
            });
            SipMixinLife(target, 'beforeDestroy', function () {
                let fns = this[eventFnKey];
                this[eventFnKey] = null;
                _.forEach(fns, function (fn) {
                    this.$el.removeEventListener(event, fn);
                }.bind(this));
            });
        }
    };
}


export const SipStoreState = State;

export const SipStoreGetter = Getter;

export const SipStoreAction = Action;

export const SipStoreMutation = Mutation;

export const SipVueProvide = Provide;

export const SipVueInject = Inject;
