//定义模型(model)
export interface StorageModel {

    storageId?: string;
    storageName?: string;
    regionId?: string;
    location?: string;
    zoneCode?: string;
    zoneCodeList?:string[];
    description?: any;
    scheduleTag?: string;
    availableSpace?: number;
    isLocal?: number;

}