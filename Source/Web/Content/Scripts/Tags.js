var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tags = (function () {
    function Tags(container) {
        var _this = this;
        this.container = container;
        this.tags = new Array();
        this.displayProperty = "abbreviation";
        var tagString = container.data(Tags.dataTagsKeysKey);
        if (tagString != null) {
            var tagKeys = tagString.split(" ");
            tagKeys.forEach(function (key) {
                var tag = $.grep(Tags.allTags, function (tag) { return tag.key == key; }).shift();
                if (tag == null)
                    console.log("Unknown tag \"" + key + "\".");
                _this.tags.push(tag);
            }, this);
            this.createElements();
        }
        container.data(Tags.dataTagsKey, this);
    }
    Tags.prototype.createElements = function () {
        var _this = this;
        this.tags.forEach(function (tag) {
            tag.element = $("<li>")
                .addClass("tag " + tag.key)
                .css("background-color", tag.color.toCss())
                .data(Tags.dataTagKey, tag)
                .attr("title", tag.name)
                .attr("data-tags-key", tag.key)
                .attr("data-tags-abbr", tag.abbreviation)
                .attr("data-tags-name", tag.name)
                .attr("data-tags-exp", tag.expertise)
                .append($("<span>")
                .text(tag[_this.displayProperty]))
                .append(tag.expertise != null ? $("<span>")
                .addClass("rank")
                .text(tag.expertise) : null);
            _this.container.append(tag.element);
        }, this);
    };
    Tags.init = function () {
        Tags.colorizeTags(Tags.allTags);
    };
    Tags.colorizeTags = function (tags) {
        var colors = Tags.getColors(tags.length);
        tags.forEach(function (tag, index) {
            var colorIndex = ((index % 2) * (colors.length - 1));
            var color = colors.splice(colorIndex, 1)[0];
            tag.color = color;
        }, this);
    };
    Tags.getColors = function (count) {
        var valueMin = 20;
        var valueMax = 80;
        var valueCount = 5;
        var valueStep = ((valueMax - valueMin) / (valueCount - 1));
        var hueMax = 360;
        var hueStep = (hueMax / ((count - 1) / valueCount));
        var colors = new Array();
        for (var v = valueMin; v <= valueMax; v += valueStep) {
            for (var h = 0; h <= hueMax; h += hueStep) {
                var rgb = Tags.convertHsvToRgb(h, 100, v);
                colors.push(rgb);
            }
        }
        return colors;
    };
    // Based on: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    Tags.convertHsvToRgb = function (h, s, v) {
        var r, g, b, i, f, p, q, t;
        h /= 360;
        s /= 100;
        v /= 100;
        i = Math.floor(h * 6);
        f = ((h * 6) - i);
        p = (v * (1 - s));
        q = (v * (1 - f * s));
        t = (v * (1 - (1 - f) * s));
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        r = Math.floor(r * 255);
        g = Math.floor(g * 255);
        b = Math.floor(b * 255);
        return new Rgb(r, g, b);
    };
    Tags.dataTagsKey = "tags";
    Tags.dataTagsKeysKey = "tags-keys";
    Tags.dataTagKey = "tags";
    Tags.allTags = new Array();
    return Tags;
})();
var ExpertiseLayoutMode;
(function (ExpertiseLayoutMode) {
    ExpertiseLayoutMode[ExpertiseLayoutMode["Linear"] = 0] = "Linear";
})(ExpertiseLayoutMode || (ExpertiseLayoutMode = {}));
var Expertise = (function (_super) {
    __extends(Expertise, _super);
    function Expertise(container, options) {
        if (options === void 0) { options = null; }
        _super.call(this, container);
        this.container = container;
        this.minSize = 30;
        this.maxSize = 100;
        this.fixedHeight = null;
        this.padding = 4;
        this.layouts = {};
        this.displayProperty = "name";
        this.layoutMode = ExpertiseLayoutMode.Linear;
        this.tags = $.grep(Tags.allTags, function (tag) { return tag.expertise != null; });
        this.initLayouts();
        $.extend(true, this, options);
        this.orderTags();
        this.sizeTags();
        this.createElements();
        $(document).ready(function () {
            this.layoutTags();
            this.registerEvents();
        }.bind(this));
    }
    Expertise.prototype.initLayouts = function () {
        this.layouts[ExpertiseLayoutMode.Linear] = {
            func: this.layoutTagsLinear,
            options: new LinearLayoutOptions()
        };
    };
    Expertise.prototype.orderTags = function () {
        this.tags.sort(function (a, b) {
            if (a.expertise == b.expertise)
                return a.name.localeCompare(b.name);
            else if (a.expertise < b.expertise)
                return 1;
            return -1;
        });
    };
    Expertise.prototype.sizeTags = function () {
        var _this = this;
        var sizeRange = (this.maxSize - this.minSize);
        var values = this.tags.map(function (tag) { return tag.expertise; });
        var min = Math.min.apply(Math, values);
        var max = Math.max.apply(Math, values);
        var range = (max - min);
        this.tags.forEach(function (tag) {
            var expertise = tag.expertise;
            var relativeExpertise = ((expertise - min) / range);
            var size = Math.floor(_this.minSize + (relativeExpertise * sizeRange));
            tag.size = size;
        }, this);
    };
    Expertise.prototype.layoutTags = function () {
        this.layouts[this.layoutMode].func.call(this, this.layouts[this.layoutMode].options);
    };
    Expertise.prototype.layoutTagsLinear = function (options) {
        var _this = this;
        var firstTag = this.tags[0];
        var tagPaddingTop = parseInt(firstTag.element.css("padding-top"));
        var tagWidthOffset = (firstTag.element.outerWidth() - firstTag.element.width());
        var tagHeightOffset = (firstTag.element.outerHeight() - firstTag.element.height());
        var currentSize = null;
        var maxRowHeight = null;
        var top = 0;
        var left = 0;
        var zIndex = this.tags.length;
        var availableWidth = this.container.innerWidth();
        this.tags.forEach(function (tag, index) {
            var nextTop = (top + maxRowHeight + _this.padding);
            if (currentSize == null || currentSize != tag.size) {
                if (currentSize != null && options.linePerLevel === true)
                    top = nextTop;
                currentSize = tag.size;
                maxRowHeight = (_this.fixedHeight || Math.max(maxRowHeight, currentSize));
                if (options.linePerLevel === true)
                    left = 0;
            }
            if ((left + currentSize) > availableWidth) {
                top = nextTop;
                maxRowHeight = (_this.fixedHeight || currentSize);
                left = 0;
            }
            tag.element.css("line-height", ((_this.fixedHeight || currentSize) - tagHeightOffset) + "px");
            tag.element.css("z-index", zIndex);
            tag.element.delay(index * options.animationDelay).animate({
                width: (currentSize),
                height: (_this.fixedHeight || currentSize),
                minWidth: (currentSize),
                minHeight: (_this.fixedHeight || currentSize),
                top: top,
                left: left,
                opacity: 1
            }, {
                duration: options.animationDuration,
                easing: options.animationEasing
            });
            left += (currentSize + _this.padding);
            zIndex--;
        }, this);
        this.container.height(top + maxRowHeight);
    };
    Expertise.prototype.registerEvents = function () {
        $(window).resize(this.layoutTags.bind(this));
    };
    return Expertise;
})(Tags);
var LayoutOptions = (function () {
    function LayoutOptions(options) {
        if (options === void 0) { options = null; }
        this.animationDelay = 50;
        this.animationDuration = 800;
        this.animationEasing = "easeOutQuart";
    }
    return LayoutOptions;
})();
var LinearLayoutOptions = (function (_super) {
    __extends(LinearLayoutOptions, _super);
    function LinearLayoutOptions(options) {
        if (options === void 0) { options = null; }
        _super.call(this, null);
        this.linePerLevel = true;
        $.extend(true, this, options);
    }
    return LinearLayoutOptions;
})(LayoutOptions);
var Tag = (function () {
    function Tag(key, abbreviation, name, expertise) {
        if (name === void 0) { name = null; }
        if (expertise === void 0) { expertise = null; }
        this.key = key;
        this.abbreviation = abbreviation;
        this.name = name;
        this.expertise = expertise;
        this.color = null;
        this.element = null;
        this.size = null;
        if (abbreviation == null)
            this.abbreviation = (this.name || this.key);
        if (name == null)
            this.name = (this.abbreviation || this.key);
    }
    return Tag;
})();
var Rgb = (function () {
    function Rgb(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Rgb.prototype.toCss = function () {
        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    };
    return Rgb;
})();
jQuery.fn.extend({
    tags: function () {
        $(this).each(function () {
            new Tags($(this));
        });
    },
    getTags: function () {
        return $(this).data(Tags.dataTagsKey);
    },
    expertise: function (options) {
        if (options === void 0) { options = null; }
        $(this).each(function () {
            new Expertise($(this), options);
        });
    },
    getExpertise: function () {
        return $(this).data(Expertise.dataTagsKey);
    },
});
Tags.allTags.push(new Tag("aws", "AWS", "Amazon Web Services", 7));
Tags.allTags.push(new Tag("apache2", null, "Apache2", 6));
Tags.allTags.push(new Tag("api", "API", "API"));
Tags.allTags.push(new Tag("arcgis", null, "ArcGIS", 3));
Tags.allTags.push(new Tag("arduino", null, "Arduino", 4));
Tags.allTags.push(new Tag("webforms", "WebForms", "ASP.NET WebForms", 10));
Tags.allTags.push(new Tag("bs", null, "Bootstrap", 8));
Tags.allTags.push(new Tag("bower", null, "Bower", 9));
Tags.allTags.push(new Tag("cs", null, "C#", 10));
Tags.allTags.push(new Tag("cpp", null, "C++", 3));
Tags.allTags.push(new Tag("css", null, "CSS", 10));
Tags.allTags.push(new Tag("css3", null, "CSS3", 10));
Tags.allTags.push(new Tag("flash", null, "Flash", 3));
Tags.allTags.push(new Tag("git", null, "Git", 7));
Tags.allTags.push(new Tag("grails", null, "Grails", 3));
Tags.allTags.push(new Tag("gulp", null, "Gulp", 7));
Tags.allTags.push(new Tag("highcharts", null, "Highcharts", 6));
Tags.allTags.push(new Tag("highmaps", null, "Highmaps", 8));
Tags.allTags.push(new Tag("html", null, "HTML", 10));
Tags.allTags.push(new Tag("html5", null, "HTML5", 10));
Tags.allTags.push(new Tag("iis", "IIS", "Internet Information Services", 10));
Tags.allTags.push(new Tag("java", null, "Java", 7));
Tags.allTags.push(new Tag("js", "JS", "JavaScript", 10));
Tags.allTags.push(new Tag("ko", null, "Knockout", 7));
Tags.allTags.push(new Tag("linux", null, "Linux", 6));
Tags.allTags.push(new Tag("mantis", null, "Mantis", 8));
Tags.allTags.push(new Tag("mapping", null, "Mapping", 6));
Tags.allTags.push(new Tag("mssql", "MS SQL", "Microsoft SQL Server", 9));
Tags.allTags.push(new Tag("ssrs", null, "Microsoft SQL Server Reporting Services", 8));
Tags.allTags.push(new Tag("mvc", "MVC", "ASP.NET MVC", 10));
Tags.allTags.push(new Tag("mysql", null, "My SQL", 8));
Tags.allTags.push(new Tag("openscad", null, "OpenSCAD", 3));
Tags.allTags.push(new Tag("oracle", null, "Oracle", 5));
Tags.allTags.push(new Tag("php", null, "PHP", 5));
Tags.allTags.push(new Tag("python", null, "Python", 2));
Tags.allTags.push(new Tag("redmine", null, "Redmine", 6));
Tags.allTags.push(new Tag("regex", "RegEx", "Regular Expressions", 9));
Tags.allTags.push(new Tag("rails", "Rails", "Ruby on Rails", 6));
Tags.allTags.push(new Tag("sl", null, "Silverlight", 4));
Tags.allTags.push(new Tag("svn", "SVN", "Subversion", 9));
Tags.allTags.push(new Tag("tfs", "TFS", "Team Foundation Server", 6));
Tags.allTags.push(new Tag("tfvc", "TFVC", "TF Version Control", 7));
Tags.allTags.push(new Tag("tomcat", null, "Tomcat", 7));
Tags.allTags.push(new Tag("uiux", null, "UI/UX", 7));
Tags.allTags.push(new Tag("vb", "VB.NET", "Visual Basic .NET", 8));
Tags.allTags.push(new Tag("weblogic", null, "WebLogic", 10));
Tags.allTags.push(new Tag("windows", null, "Windows", 10));
Tags.allTags.push(new Tag("winserver", null, "Windows Server", 9));
Tags.allTags.push(new Tag("wcf", "WCF", "Windows Communication Foundation", 7));
Tags.allTags.push(new Tag("winforms", "WinForms", "Windows Forms", 10));
Tags.allTags.push(new Tag("wp", null, "Windows Phone", 4));
Tags.allTags.push(new Tag("xml", null, "XML", 10));
Tags.allTags.push(new Tag("xsd", null, "XSD", 8));
Tags.allTags.push(new Tag("xslt", null, "XSLT", 9));
Tags.init();
//# sourceMappingURL=Tags.js.map