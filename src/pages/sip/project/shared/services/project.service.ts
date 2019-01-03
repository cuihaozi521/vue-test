import { SipHttpDef, SipHttpDefFunction, SipInjectable, SipService } from '@libs/sip';
import { ProjectModel } from '../models/project.model';

@SipInjectable({ scope: 'business' })
export class ProjectService extends SipService {

    @SipHttpDef<ProjectModel[]>({
        url: 'api/project/getSimpleProjectInfo',
        defMethod: 'get',
        cache: true,
        params: { userMode: 'buy', showRegion: false }
    })
    getSimpleProjectInfo: SipHttpDefFunction<{
        userMode?: 'buy' | 'cust';
        showRegion?: boolean;
        vdcId?: string;
    }, ProjectModel[]>;

}