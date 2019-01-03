import { SipLibMixin, SipMixin } from "@libs/sip";
import projectSelect from './components/project-select.component.vue';


export const ProjectSharedMixin: SipMixin = {
    mixins: [SipLibMixin],
    components: {
        'project-select': projectSelect
    }
};