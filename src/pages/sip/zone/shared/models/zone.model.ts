//定义模型(model)
export interface ZoneModel {
    sipId?:string;
    regionId?: string;
    code?: string;
    name?: string;
    vm?: any;
    ifShrink?: any;
    strategyId?: any;
    ebsVolume?: any;
    maxEbs?: any;
    maxStorage?: any;
    memo?: any;
    dispatchStrategy?: any;
    extendDisk?: any;
    extendEbs?: any;

}