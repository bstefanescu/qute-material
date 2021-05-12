import window from '@qutejs/window';
import Qute from '@qutejs/runtime';
import {AppTemplate, mAppPage, mAppSidebar} from './app.jsq';
import './app.css';


const {ViewModel, Template, On } = Qute;

/**
 * To turn on rtl you must set app.env.rtl = true;
 */
@Template(AppTemplate)
class mApp extends ViewModel {

    get dir() {
        return this.$app.env.rtl ? 'rtl' : 'ltr';
    }

    get _computedClass() {
        return [
            'qm-App',
            this.hasHeader && 'qm-App--fixed-header',
            this.hasFooter && 'qm-App--fixed-header'
        ]
    }

    get hasHeader() {
        return !!this.$slots && this.$slots.header;
    }

    get hasFooter() {
        return !!this.$slots && this.$slots.footer;
    }

    @On("navigate")
    onNavigate(evt) {
        const target = evt.detail;
        if (target[0] === '#') window.location.hash = target;
        else window.location = target;
    }

}


export { mApp, mAppPage, mAppSidebar };
