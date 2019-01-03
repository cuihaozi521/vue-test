import { SipMixin } from "@libs/sip";
import { ProjectSharedMixin } from '../../../project/shared/project-shared.mixin';
import { RegionSharedMixin } from '../../../region/shared/region-shared.mixin';
import { StorageSharedMixin } from '../../../storage/shared/storage-shared.mixin';
import { ZoneSharedMixin } from '../../../zone/shared/zone-shared.mixin';

export const VolumeSharedMixin: SipMixin = {
    mixins: [ProjectSharedMixin, RegionSharedMixin, StorageSharedMixin, ZoneSharedMixin],
    components: {

    }
};