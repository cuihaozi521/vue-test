import { SipForm, SipInit, SipInject, SipLibMixin, SipPage, SipReady, SipValidator, SipVueComponent, SipVueRef } from '@libs/sip';
import { StorageModel } from '../../storage/shared/models/storage.model';
import { StorageService } from '../../storage/shared/services/storage.service';
import { VolumeSharedMixin } from './shared/volume-shared.mixin';

@SipVueComponent({
    mixins: [SipLibMixin, VolumeSharedMixin]
})
export default class VolumeCreate extends SipPage {

    params = { id: '', name: '' };

    @SipInit()
    private _init1() {
        this.params = this.$params(this.params);
        this.$logger.debug('init', this.params);
    }

    @SipReady()
    private _ready() {
    }

    model = {
        projectId: "",
        regionId: "",
        storageId: "",
        zoneCode: "",
        name: "",
        size: 1,
        desc: ""
    };

    @SipVueRef('form1')
    form1: SipForm;

    formValidator1 = SipValidator.createDescriptor({
        projectId: [SipValidator.required(), '请选择项目'],
        regionId: [SipValidator.required(), '请选择区域'],
        storageId: [SipValidator.required(), '请选择存储设备'],
        size: [SipValidator.required(), SipValidator.min(1), SipValidator.integer()],
        name: [SipValidator.required(), '请输入名称']
    });

    zoneCodes: string[] = null;
    @SipInject(StorageService)
    storageSrv: StorageService;

    changeStorage(stroage: StorageModel) {
        if (!stroage) {
            this.zoneCodes = null;
        } else {
            this.storageSrv.getStorages
        }
    }

    handleSubmit() {
        this.form1.validate(valid => {
            if (!valid) {
                this.$Message.error(this.formValidator1.$errInfo);
                return;
            }
            console.log(this.model);
            this.$logger.debug('model', this.model);
        });
    }

    handleReset() {
        this.form1.resetFields();
    }
}