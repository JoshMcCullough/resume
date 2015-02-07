class Tags {
    static dataTagsKey = "tags";
    static dataTagsKeysKey = "tags-keys";
    static dataTagKey = "tags";
    static allTags = new Array<Tag>();

    public tags = new Array<Tag>();

    constructor(public container: JQuery) {
        var tagString = container.data(Tags.dataTagsKeysKey);

        if (tagString != null) {
            var tagKeys = tagString.split(" ");

            tagKeys.forEach((key) => {
                var tag = $.grep(Tags.allTags, (tag) => tag.key == key).shift();

                if (tag == null)
                    console.log("Unknown tag \"" + key + "\".");

                this.tags.push(tag);
            }, this);

            this.createElements();
        }

        container.data(Tags.dataTagsKey, this);
    }

    protected createElements(): void {
        this.tags.forEach((tag) => {
            tag.element = $("<li>")
                .addClass("tag " + tag.key)
                .css("background-color", tag.color.toCss())
                .attr("title", tag.name)
                .data(Tags.dataTagKey, tag)
                .append($("<span>")
                    .text(tag.name));

            this.container.append(tag.element);
        }, this);
    }

    public static init(): void {
        Tags.colorizeTags(Tags.allTags);
    }

    private static colorizeTags(tags: Array<Tag>): void {
        var colors = Tags.getColors(tags.length);

        tags.forEach((tag, index) => {
            var colorIndex = ((index % 2) * (colors.length - 1));
            var color = colors.splice(colorIndex, 1)[0];

            tag.color = color;
        }, this);
    }

    private static getColors(count: number): Array<Rgb> {
        var valueMin = 20;
        var valueMax = 80;
        var valueCount = 5;
        var valueStep = ((valueMax - valueMin) / (valueCount - 1));
        var hueMax = 360;
        var hueStep = (hueMax / ((count - 1) / valueCount));
        var colors = new Array<Rgb>();

        for (var h = 0; h <= hueMax; h += hueStep) {
            for (var v = valueMin; v <= valueMax; v += valueStep) {
                var rgb = Tags.convertHsvToRgb(h, 100, v);

                colors.push(rgb);
            }
        }

        return colors;
    }

    private static convertHsvToRgb(h: number, s: number, v: number): Rgb {
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
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        r = Math.floor(r * 255);
        g = Math.floor(g * 255);
        b = Math.floor(b * 255);

        return new Rgb(r, g, b);
    }
}

class Expertise extends Tags {
    private minSize = 30;
    private maxSize = 100;
    private padding = 4;

    constructor(public container: JQuery, options: Object = null) {
        super(container);

        this.tags = $.grep(Tags.allTags, (tag) => tag.expertise != null);

        $.extend(this, options);

        this.orderTags();
        this.sizeTags();
        this.createElements();
        this.layoutTags();
    }

    public orderTags(): void {
        this.tags.sort((a, b) => {
            if (a.expertise == b.expertise)
                return a.name.localeCompare(b.name);
            else if (a.expertise < b.expertise)
                return 1;

            return -1;
        });
    }

    public sizeTags(): void {
        var sizeRange = (this.maxSize - this.minSize);
        var values = this.tags.map((tag) => tag.expertise);
        var min = Math.min.apply(Math, values);
        var max = Math.max.apply(Math, values);
        var range = (max - min);

        this.tags.forEach((tag) => {
            var expertise = tag.expertise;
            var relativeExpertise = ((expertise - min) / range);
            var size = Math.floor(this.minSize + (relativeExpertise * sizeRange));

            tag.size = size;
        }, this);
    }

    public layoutTags(): void {
        var firstTag = this.tags[0];
        var tagPaddingTop = parseInt(firstTag.element.css("padding-top"));
        var tagWidthOffset = (firstTag.element.outerWidth() - firstTag.element.width());
        var tagHeightOffset = (firstTag.element.outerHeight() - firstTag.element.height());
        var currentSize = null;
        var top = 0;
        var left = 0;
        var availableWidth = this.container.innerWidth();

        this.tags.forEach((tag) => {
            if (currentSize == null || currentSize != tag.size) {
                if (currentSize != null)
                    top += (currentSize + this.padding);

                currentSize = tag.size;
                left = 0;
            }
            else
                left += (currentSize + this.padding);

            tag.element.width(currentSize - tagWidthOffset);
            tag.element.height(currentSize - tagHeightOffset);
            tag.element.css("top", top);
            tag.element.css("left", left);
            tag.element.css("line-height", (currentSize - tagHeightOffset - tagPaddingTop) + "px");
        }, this);

        this.container.height(top + currentSize);
    }
}

class Tag {
    public color: Rgb = null;
    public element: JQuery = null;
    public size: number = null;

    constructor(public key: string, public name: string = null, public expertise: number = null) {
        if (name == null)
            this.name = this.key;
    }
}

class Rgb {
    constructor(public r: number, public g: number, public b: number) {
    }

    public toCss(): string {
        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }
}

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