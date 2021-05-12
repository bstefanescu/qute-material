import {document} from '@qutejs/window';
import Qute from '@qutejs/runtime';
import DatePickerTemplate from './date-picker.jsq';
import './date-picker.css';

const { ViewModel, Property, Template, On } = Qute;

function getDaysInMonth(year, month) {
    return new Date(year, month+1, 0).getDate();
}

function getFirstDayWeekIndex(year, month) {
    return new Date(year, month, 1).getDay();
}

const LANGS = {
    en: {
        daysOfWeek_short: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        daysOfWeew: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months_short: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
        months: ['January', 'February', 'Mars', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    }
}

/**
 *
 * @param {Number} year the target year
 * @param {Number} month the target month
 * @param {Date} date the selected date if any
 * @param {Boolean} sundayLast whether or not the sunday is showed as the last da in the week or as the first day in the week
 */
function getDaysRange(year, month, date, sundayLast) {
    const days = [];
    const firstDayWeekIndex = getFirstDayWeekIndex(year, month);
    const daysInMonth = getDaysInMonth(year, month);

    let leading = firstDayWeekIndex;
    for (let i=leading; i > 0; i--) {
        days.push({day: new Date(year, month, 1-i).getDate(), class: 'is-disabled'});
    }

    for (let i=1; i<=daysInMonth; i++) {
        days.push({day: i});
    }

    let trailing = 42 - days.length; // 42 = 6*7 we need 6 lines of week days
    for (let i=0; i<trailing; i++) {
        days.push({day: new Date(year, month, daysInMonth+i+1).getDate(), class: 'is-disabled'});
    }

    const now = new Date();
    // mark the `now` date if year / month matches
    if (now.getFullYear() === year && now.getMonth() === month) {
        const nowDate = now.getDate();
        const entry = days[firstDayWeekIndex + nowDate];
        entry.class = entry.class ? entry.class+' is-now' : 'is-now';
    }

    // mark the selected date if year / month matches
    if (date && date.getFullYear() === year && date.getMonth() === month) {
        const selectedDate = date.getDate();
        const entry = days[firstDayWeekIndex + selectedDate];
        entry.class = entry.class ? entry.class+' is-selected' : 'is-selected';
    }

    return days;
}

function getYearsRange(yearsRange, date, refYear) {
    // 4 cols and 7 rows
    const years = [];
    const firstYear = yearsRange[0];
    const lastYear = yearsRange[1];
    for (let i=firstYear; i<=lastYear; i++) {
        years.push({year: i});
    }
    if (refYear >= firstYear && refYear <= lastYear) {
        const entry = years[refYear - firstYear];
        entry.class = entry.class ? entry.class+' is-now' : 'is-now';
    }
    if (date) {
        const selectedYear = date.getFullYear();
        if (selectedYear >= firstYear && selectedYear <= lastYear) {
            const entry = years[selectedYear - firstYear];
            entry.class = entry.class ? entry.class+' is-selected' : 'is-selected';
        }
    }
    return years;
}

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'Mars', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Template(DatePickerTemplate)
class mDatePicker extends ViewModel {

    _daysTable = null;
    _yearsTable = null;
    _yearsRange = null;
    _cDate = new Date(); // currently displayed year / month

    @Property(String) lang = 'en';
    @Property(Boolean) sundayLast = false;
    @Property(Date) value; // the selected date

    get _computedClass() {
        const classes = ['qm-DatePicker'];
        if (this.outline) classes.push('qm-DatePicker--outline');
        if (this.floating) classes.push('qm-DatePicker--floating');
        return classes;
    }
    get toggleModeIcon() {
        return this._yearsRange ? 'arrow_drop_up' : 'arrow_drop_down';
    }

    get monthLabel() {
        return LANGS[this.lang || 'en'].months[this._cDate.getMonth()];
    }

    get yearLabel() {
        return this._cDate.getFullYear();
    }

    get dateLabel() {
        return this._yearsRange
            ? this._yearsRange[0]+' - '+ this._yearsRange[1]
            : this.monthLabel+' '+this.yearLabel;
    }

    @On('click', '.qm-DatePicker-day')
    onDayClick(evt) {
        const sel = this.$el.querySelector('.qm-DatePicker-day.is-selected');
        if (sel) sel.classList.remove('is-selected');
        evt.target.classList.add('is-selected');
        this.value = new Date(this._cDate.getFullYear(), this._cDate.getMonth(), parseInt(evt.target.textContent));
        this.emit('change', this);
    }

    @On('click', '.qm-DatePicker-year')
    onYearClick(evt) {
        const sel = this.$el.querySelector('.qm-DatePicker-year.is-selected');
        if (sel) sel.classList.remove('is-selected');
        evt.target.classList.add('is-selected');
        this._cDate = new Date(parseInt(evt.target.textContent), this._cDate.getMonth(), this._cDate.getDate());
        this._yearsRange = null;
        this.update();
    }

    initialized() {
        this._cDate = this.value || new Date();
        const daysOfWeek = LANGS[this.lang || 'en'].daysOfWeek_short;
        if (this.sundayLast) {
            // move sunday on last position
            this.daysOfWeek = daysOfWeek.slice(1);
            this.daysOfWeek.push(daysOfWeek[6]);
        } else {
            this.daysOfWeek = daysOfWeek;
        }
    }

    toggleYearPage() {
        if (this._yearsRange) {
            this._yearsRange = null;
        } else {
            const year = this._cDate.getFullYear();
            this._yearsRange = [year - 14, year + 13];
        }
        this._daysTable = null;
        this._yearsTable = null;
        this.update();
    }

    showNextPage() {
        if (this._yearsRange) {
            this._yearsRange = [this._yearsRange[0]+28, this._yearsRange[1]+28]
            this._yearsTable = null;
        } else {
            this._cDate = new Date(this._cDate.getFullYear(), this._cDate.getMonth()+1, this._cDate.getDate());
            this._daysTable = null;
        }
        this.update();
    }

    showPrevPage() {
        if (this._yearsRange) {
            this._yearsRange = [this._yearsRange[0]-28, this._yearsRange[1]-28]
            this._yearsTable = null;
        } else {
            this._cDate = new Date(this._cDate.getFullYear(), this._cDate.getMonth()-1, this._cDate.getDate());
            this._daysTable = null;
        }
        this.update();
    }

    getDateTable() {
        if (this._yearsRange) {
            if (!this._yearsTable) {
                this._yearsTable = this.generateYearsTable();
            }
            return this._yearsTable;
        } else {
            if (!this._daysTable) {
                this._daysTable = this.generateDaysTable();
            }
            return this._daysTable;
        }
    }

    generateDaysTable() {
        const days = getDaysRange(this._cDate.getFullYear(), this._cDate.getMonth(), this.value, this.sundayLast);

        const table = document.createElement('DIV');
        table.className = 'qm-DatePicker-days';

        // create the header
        const daysOfWeek = this.daysOfWeek;
        for (let i=0; i<7; i++) {
            const cell = document.createElement('DIV');
            cell.className = 'qm-DatePicker-weekday';
            cell.textContent = daysOfWeek[i];
            table.appendChild(cell);
        }

        // create 6 rows or 7 cells for each week to display in the month page
        for (let i=0,l=days.length; i<l; i++) {
            const day = days[i];
            const cell = document.createElement('DIV');
            cell.className = day.class ? 'qm-DatePicker-day '+day.class : 'qm-DatePicker-day';
            cell.textContent = day.day;
            table.appendChild(cell);
        }

        return table;
    }

    generateYearsTable() {
        const refYear = this.value ? this.value.getFullYear() : this._cDate.getFullYear();
        const years = getYearsRange(this._yearsRange, this.value, refYear);

        const table = document.createElement('DIV');
        table.className = 'qm-DatePicker-years';

        // create 7 rows with 4 cells
        for (let i=0,l=years.length; i<l; i++) {
            const year = years[i];
            const cell = document.createElement('DIV');
            cell.className = year.class ? 'qm-DatePicker-year '+year.class : 'qm-DatePicker-year';
            cell.textContent = year.year;
            table.appendChild(cell);
        }

        return table;
    }
}

mDatePicker.languages = LANGS;

export { mDatePicker };
