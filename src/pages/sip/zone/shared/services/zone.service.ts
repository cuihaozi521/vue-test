import { SipHttpDef, SipHttpDefFunction, SipInjectable, SipService } from '@libs/sip';
import { ZoneModel } from '../models/zone.model';

@SipInjectable({ scope: 'business' })
export class ZoneService extends SipService {

    @SipHttpDef<ZoneModel[]>({
        url: 'api/basicData/getRegionZoneDetail',
        defMethod: 'get',
        cache: true,
        sipId: true
    })
    getRegionZoneDetail: SipHttpDefFunction<{
        regionId?: string;
    }, ZoneModel[]>;


}