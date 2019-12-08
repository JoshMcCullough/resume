/// <reference path="Definitions/jQuery/jquery.d.ts" />
var InfoSlider = /** @class */ (function () {
    function InfoSlider(target, onSliding) {
        this.sliding = false;
        this.minWidth = 15;
        this.target = $(target);
        this.label = this.target.find(".label");
        this.content = this.target.find(".content");
        this.slider = this.target.find(".slider");
        this.sliderGrip = this.slider.find(".grip");
        this.hint = this.slider.find(".hint");
        this.onSliding = onSliding;
        this.init();
    }
    InfoSlider.prototype.init = function () {
        this.target.data(InfoSlider.dataKey, this);
        this.setSliderWidth(this.maxWidth());
        this.enable();
    };
    InfoSlider.prototype.sliderGripMouseDown = function () {
        this.sliding = true;
        this.target.addClass("sliding");
        this.target.parents().css({ cursor: "ew-resize" });
    };
    InfoSlider.prototype.documentMouseMove = function (e) {
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
    };
    InfoSlider.prototype.documentMouseUp = function () {
        this.sliding = false;
        this.target.removeClass("sliding");
        this.target.parents().css({ cursor: "auto" });
    };
    InfoSlider.prototype.maxWidth = function () {
        return (this.target.width() - (this.label.position().left + this.label.outerWidth(true)));
    };
    InfoSlider.prototype.setSliderWidth = function (width) {
        this.sliding = false;
        this.slider.width(Math.max(this.minWidth, Math.min(width, this.maxWidth())));
    };
    InfoSlider.prototype.setContent = function (content) {
        this.content.empty();
        this.content.append(content);
    };
    InfoSlider.prototype.disable = function () {
        var $doc = $(document);
        this.sliderGrip.unbind("mousedown", this.sliderGripMouseDown.bind(this));
        $doc.unbind("mousemove", this.documentMouseMove.bind(this));
        $doc.unbind("mouseup", this.documentMouseUp.bind(this));
        this.target.addClass("disabled");
    };
    InfoSlider.prototype.enable = function () {
        var $doc = $(document);
        this.sliderGrip.mousedown(this.sliderGripMouseDown.bind(this));
        $doc.mousemove(this.documentMouseMove.bind(this));
        $doc.mouseup(this.documentMouseUp.bind(this));
        this.target.removeClass("disabled");
    };
    InfoSlider.dataKey = "info_slider";
    return InfoSlider;
}());
jQuery.fn.extend({
    infoSlider: function (onSliding) {
        return new InfoSlider($(this), onSliding);
    },
    getInfoSlider: function () {
        return $(this).data(InfoSlider.dataKey);
    }
});
//# sourceMappingURL=InfoSlider.js.map