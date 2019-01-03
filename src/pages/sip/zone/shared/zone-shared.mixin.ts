import { SipLibMixin, SipMixin } from "@libs/sip";
import zoneSelect from './components/zone-select.component.vue';

export const ZoneSharedMixin: SipMixin = {
    mixins: [SipLibMixin],
    components: {
        'zone-select': zoneSelect
    }
};