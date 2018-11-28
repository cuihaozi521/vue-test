import { SipVueComponent, SipVueProp } from '../../vue-extends/decorators/sip-vue-property-decorator';
import { SipComponent } from '../../vue-extends/sip-component';

@SipVueComponent({})
export default class SipPageHeaderComponent extends SipComponent {

    @SipVueProp({
        type:Boolean,
        default:false
    })
    showBack:boolean;

    back(){
        this.$close();
    }

}