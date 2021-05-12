import Qute from '@qutejs/runtime';
import ProgressTemplate from './progress.jsq';
import './progress.css';

const { ViewModel, Template, Property } = Qute;

@Template(ProgressTemplate)
class mProgress extends ViewModel {

    // progress value in percent.
    // use -1 (or a negative value) for unknown progress
    @Property(Number) value = 0;

    get percentValue() {
        const value = this.value;
        if (!value || value < 0 || typeof value !== 'number') return 0;
        else if (value > 100) return 100;
        else return value;
    }

    render(r) {
        return this.value < 0 ? UnknownProgress(r) : TrackedProgress(r);
    }

    done() {
        this.value = 100;
        return this;
    }

}

export { mProgress };