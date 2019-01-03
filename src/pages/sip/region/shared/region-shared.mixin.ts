import { SipLibMixin, SipMixin } from '@libs/sip';
import regionBtnSelect from './components/region-btn-select.component.vue';


export const RegionSharedMixin: SipMixin = {
    mixins: [SipLibMixin],
    components: {
        'region-btn-select': regionBtnSelect
    }
};