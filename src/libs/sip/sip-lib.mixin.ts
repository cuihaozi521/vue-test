import { SipLibComponents } from './components';
import { SipLibDirectives } from './directives';
import { SipLibFilters } from './filters';
import { SipMixin } from './vue-extends/decorators/sip-vue-property-decorator';

export const SipLibMixin: SipMixin = {
    components: {
        ...SipLibComponents
    },
    directives: {
        ...SipLibDirectives
    },
    filters: {
        ...SipLibFilters
    }
};