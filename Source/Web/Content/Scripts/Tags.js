var __extends = this.__extends || function (d, b) {
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
            tag.element = $("<li>").addClass("tag " + tag.key).css("background-color", tag.color.toCss()).attr("title", tag.name).data(Tags.dataTagKey, tag).append($("<span>").text(tag.name));
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
        for (var h = 0; h <= hueMax; h += hueStep) {
            for (var v = valueMin; v <= valueMax; v += valueStep) {
                var rgb = Tags.convertHsvToRgb(h, 100, v);
                colors.push(rgb);
            }
        }
        return colors;
    };
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
var Expertise = (function (_super) {
    __extends(Expertise, _super);
    function Expertise(container, options) {
        if (options === void 0) { options = null; }
        _super.call(this, container);
        this.container = container;
        this.minSize = 30;
        this.maxSize = 100;
        this.padding = 4;
        this.tags = $.grep(Tags.allTags, function (tag) { return tag.expertise != null; });
        $.extend(this, options);
        this.orderTags();
        this.sizeTags();
        this.createElements();
        this.layoutTags();
    }
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
        var _this = this;
        var firstTag = this.tags[0];
        var tagPaddingTop = parseInt(firstTag.element.css("padding-top"));
        var tagWidthOffset = (firstTag.element.outerWidth() - firstTag.element.width());
        var tagHeightOffset = (firstTag.element.outerHeight() - firstTag.element.height());
        var currentSize = null;
        var top = 0;
        var left = 0;
        var availableWidth = this.container.innerWidth();
        this.tags.forEach(function (tag) {
            if (currentSize == null || currentSize != tag.size) {
                if (currentSize != null)
                    top += (currentSize + _this.padding);
                currentSize = tag.size;
                left = 0;
            }
            else
                left += (currentSize + _this.padding);
            tag.element.width(currentSize - tagWidthOffset);
            tag.element.height(currentSize - tagHeightOffset);
            tag.element.css("top", top);
            tag.element.css("left", left);
            tag.element.css("line-height", (currentSize - tagHeightOffset - tagPaddingTop) + "px");
        }, this);
        this.container.height(top + currentSize);
    };
    return Expertise;
})(Tags);
var Tag = (function () {
    function Tag(key, name, expertise) {
        if (name === void 0) { name = null; }
        if (expertise === void 0) { expertise = null; }
        this.key = key;
        this.name = name;
        this.expertise = expertise;
        this.color = null;
        this.element = null;
        this.size = null;
        if (name == null)
            this.name = this.key;
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
        return new Tags($(this));
    },
    getTags: function () {
        return $(this).data(Tags.dataTagsKey);
    },
    expertise: function () {
        return new Expertise($(this));
    },
    getExpertise: function () {
        return $(this).data(Expertise.dataTagsKey);
    },
});
Tags.allTags.push(new Tag("aws", "Amazon Web Services", 7));
Tags.allTags.push(new Tag("apache2", "Apache2", 6));
Tags.allTags.push(new Tag("api", "API"));
Tags.allTags.push(new Tag("arcgis", "ArcGIS", 3));
Tags.allTags.push(new Tag("arduino", "Arduino", 4));
Tags.allTags.push(new Tag("webforms", "ASP.NET WebForms", 10));
Tags.allTags.push(new Tag("ontime", "Axosoft OnTime", 7));
Tags.allTags.push(new Tag("bs", "Bootstrap", 8));
Tags.allTags.push(new Tag("cs", "C#", 10));
Tags.allTags.push(new Tag("cpp", "C++", 3));
Tags.allTags.push(new Tag("css", "CSS", 10));
Tags.allTags.push(new Tag("css3", "CSS3", 10));
Tags.allTags.push(new Tag("flash", "Dlash", 3));
Tags.allTags.push(new Tag("git", "Git", 7));
Tags.allTags.push(new Tag("grails", "Grails", 3));
Tags.allTags.push(new Tag("html", "HTML", 10));
Tags.allTags.push(new Tag("html5", "HTML5", 10));
Tags.allTags.push(new Tag("iis", "IIS", 10));
Tags.allTags.push(new Tag("java", "Java", 7));
Tags.allTags.push(new Tag("js", "JavaScript", 10));
Tags.allTags.push(new Tag("ko", "Knockout", 7));
Tags.allTags.push(new Tag("linux", "Linux", 6));
Tags.allTags.push(new Tag("mantis", "Mantis", 6));
Tags.allTags.push(new Tag("mapping", "Mapping", 6));
Tags.allTags.push(new Tag("mssql", "Microsoft SQL Server", 9));
Tags.allTags.push(new Tag("mvc", "Model-View-Controller", 10));
Tags.allTags.push(new Tag("msoffice", "MS Office", 6));
Tags.allTags.push(new Tag("mysql", "My SQL", 7));
Tags.allTags.push(new Tag("openscad", "OpenSCAD", 3));
Tags.allTags.push(new Tag("oracle", "Oracle", 5));
Tags.allTags.push(new Tag("php", "PHP", 5));
Tags.allTags.push(new Tag("python", "Python", 2));
Tags.allTags.push(new Tag("redmine", "Redmine", 6));
Tags.allTags.push(new Tag("regex", "Regular Expressions", 9));
Tags.allTags.push(new Tag("rails", "Ruby on Rails", 6));
Tags.allTags.push(new Tag("sl", "Silverlight", 4));
Tags.allTags.push(new Tag("svn", "Subversion", 9));
Tags.allTags.push(new Tag("svg", "SVG", 7));
Tags.allTags.push(new Tag("tfs", "Team Foundation Server", 9));
Tags.allTags.push(new Tag("tfvc", "Team Foundation Version Control", 7));
Tags.allTags.push(new Tag("tomcat", "Tomcat", 7));
Tags.allTags.push(new Tag("uiux", "UI/UX", 7));
Tags.allTags.push(new Tag("vb", "Visual Basic .NET", 8));
Tags.allTags.push(new Tag("weblogic", "WebLogic", 10));
Tags.allTags.push(new Tag("windows", "Windows", 10));
Tags.allTags.push(new Tag("wcf", "Windows Communication Foundation", 7));
Tags.allTags.push(new Tag("winforms", "Windows Forms", 10));
Tags.allTags.push(new Tag("wp", "Windows Phone", 4));
Tags.allTags.push(new Tag("xml", "XML", 10));
Tags.allTags.push(new Tag("xsd", "XSD", 7));
Tags.allTags.push(new Tag("xslt", "XSLT", 9));
Tags.init();
//# sourceMappingURL=Tags.js.map