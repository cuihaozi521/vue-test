//定义模型(model)
export interface ProjectSimpleModel {

    projectId?: string;
    projectName?: string;
    parentProjectId?: any;
    projectType?: string;
    subProjectValidTypes?: string[];
    canModifyProjectType?: boolean;
    treeLevel?: number;
    fullPath?: string;
    fullName?: string;
    regions?: {
        regionId?: string;
        regionName?: string;
        isPublicCloud?: boolean;
    }[];
    custId?: string;
    departmentId?: string;

}
