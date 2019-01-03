import { SipLibMixin, SipMixin } from '@libs/sip';
import storageSelect from './components/storage-select.component.vue';

export const StorageSharedMixin: SipMixin = {
    mixins: [SipLibMixin],
    components: {
        'storage-select': storageSelect
    }
};