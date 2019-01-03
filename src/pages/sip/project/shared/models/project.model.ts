//定义模型(model)
export interface ProjectModel {

    projectId?: string;
    projectName?: string;
    parentProjectId?: any;
    projectType?: string;
    subProjectValidTypes?: any[];
    canModifyProjectType?: boolean;
    treeLevel?: number;
    fullPath?: string;
    fullName?: string;
    regions?: any[];
    custId?: string;
    departmentId?: string;

}