class myCalendar {


    constructor(clickHandler, config = {
        currentDate: new Date(),
        calBody: '#calendarBody',
        calHeader: '#calendarHeader',
        calHeaderMonth: '#month',
        calDayNode: '#dayNode',
        calMonthNode: '#monthSelectNode',
        calMonthList: '.month-list',
        calHeaderYear: '#year',
    }) {

        this.config = config;
        this.calEvent = [];
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'];
        this.daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.clickHandler = clickHandler;
        this.renderCalendar(true);
    }


    getEvent(date) {
        return (this.calEvent[date]) ? this.calEvent[date] : '';
    }

    addCalEvent(date, string) {
        if (string === '') this.calEvent[date] = null;
        this.calEvent[date] = string.replace(/<\/?[^>]+>/gi, '');
    }

    setMonth(month) {
        this.config.currentDate.setMonth(month);
        this.renderCalendar();
    }

    setYear(year) {

        this.config.currentDate.setYear(year);
        this.renderCalendar();
    }

    nextMonth() {
        this.setMonth(this.config.currentDate.getMonth() + 1)
    };

    prevMonth() {
        this.setMonth(this.config.currentDate.getMonth() - 1);
    }

    getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    startsFromDayOfWeek(month, year) {
        return new Date(year, month, 1).getDay()
    }

    fillBlanks(times) {
        for (let i = 0; i < times; i++) {
            $(this.config.calDayNode).clone().html("")
                .addClass("empty").appendTo(this.config.calBody);
        }
    }

    initWeek() {
        this.daysOfWeek.map((el) =>
            $(this.config.calDayNode).clone().html(el).addClass('week-header').appendTo(this.config.calHeader));
    }

    initMonthSelect() {
        this.months.map((el,idx) =>
            $(this.config.calMonthNode).clone().html(el).data("month",idx).appendTo(this.config.calMonthList));

    }

    getShortDate(i) {
        return this.config.currentDate.getFullYear() + '-' + this.config.currentDate.getMonth() + '-' + i;
    }

    renderCalendar(firstTime = false) {
        const dayOfWeek = this.startsFromDayOfWeek(this.config.currentDate.getMonth(),
            this.config.currentDate.getFullYear());
        const daysInMonth = this.getDaysInMonth(this.config.currentDate.getMonth(),
            this.config.currentDate.getFullYear());
        const today = new Date();

        $(this.config.calHeaderYear).val(this.config.currentDate.getFullYear());
        $(this.config.calHeaderMonth).html(this.months[this.config.currentDate.getMonth()]);
        $(this.config.calBody).html("");
        if (firstTime) {
            this.initWeek();
            this.initMonthSelect();
        }


        this.fillBlanks(dayOfWeek);

        for (let i = 1; i < daysInMonth + 1; i++) {
            const node = $(this.config.calDayNode).clone().html(i)
                .addClass('day').attr("data-date", this.getShortDate(i)).appendTo(this.config.calBody);

            if (this.calEvent[this.getShortDate(i)] && this.calEvent[this.getShortDate(i)] !== '') node.addClass("event");

            if (this.config.currentDate.getFullYear() === today.getFullYear() &&
                this.config.currentDate.getMonth() === today.getMonth() &&
                i === today.getDate()) {
                node.addClass("today");
            }
            node.click(this.clickHandler);
        }

        const fillWeek = (7 - (daysInMonth + dayOfWeek) % 7);
        this.fillBlanks(fillWeek);
    }

}
