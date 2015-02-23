/// <reference path="Definitions/jQuery/jquery.d.ts" />

class InfoSlider {
    public static dataKey: string = "info_slider";

    public target: JQuery;
    public label: JQuery;
    public content: JQuery;
    public slider: JQuery;
    public sliderGrip: JQuery;
    public hint: JQuery;
    public onSliding: Function;
    public sliding: boolean = false;
    public minWidth: number = 15;

    constructor(target: JQuery, onSliding: Function) {
        this.target = $(target);
        this.label = this.target.find(".label");
        this.content = this.target.find(".content");
        this.slider = this.target.find(".slider");
        this.sliderGrip = this.slider.find(".grip");
        this.hint = this.slider.find(".hint");
        this.onSliding = onSliding;

        this.init();
    }

    private init() {
        this.target.data(InfoSlider.dataKey, this);
        this.setSliderWidth(this.maxWidth());
        this.enable();
    }

    private sliderGripMouseDown() {
        this.sliding = true;
        this.target.addClass("sliding");
        this.target.parents().css({ cursor: "ew-resize" });
    }

    private documentMouseMove(e) {
        if (this.sliding !== true)
            return;

        var maxWidth = this.maxWidth();
        var newWidth = (this.target.offset().left + this.target.width() - e.clientX);

        if (newWidth >= this.minWidth && newWidth <= maxWidth) {
            this.slider.css({ width: newWidth });
            this.hint.toggle(false);

            if (this.onSliding instanceof Function)
                this.onSliding(this);
        }
    }

    private documentMouseUp() {
        this.sliding = false;
        this.target.removeClass("sliding");
        this.target.parents().css({ cursor: "auto" });
    }

    private maxWidth(): number {
        return (this.target.width() - (this.label.position().left + this.label.outerWidth(true)));
    }

    public setSliderWidth(width: number) {
        this.sliding = false;
        this.slider.width(Math.max(this.minWidth, Math.min(width, this.maxWidth())));
    }

    public setContent(content: any) {
        this.content.empty();
        this.content.append(content);
    }

    public disable() {
        var $doc = $(document);

        this.sliderGrip.unbind("mousedown", this.sliderGripMouseDown.bind(this));
        $doc.unbind("mousemove", this.documentMouseMove.bind(this));
        $doc.unbind("mouseup", this.documentMouseUp.bind(this));

        this.target.addClass("disabled");
    }

    public enable() {
        var $doc = $(document);

        this.sliderGrip.mousedown(this.sliderGripMouseDown.bind(this));
        $doc.mousemove(this.documentMouseMove.bind(this));
        $doc.mouseup(this.documentMouseUp.bind(this));

        this.target.removeClass("disabled");
    }
}

jQuery.fn.extend({
    infoSlider: function (onSliding: Function) {
        return new InfoSlider($(this), onSliding);
    },
    getInfoSlider: function () {
        return $(this).data(InfoSlider.dataKey);
    }
});

interface JQuery {
    infoSlider(onSliding: Function): InfoSlider;
    getInfoSlider(): InfoSlider;
}