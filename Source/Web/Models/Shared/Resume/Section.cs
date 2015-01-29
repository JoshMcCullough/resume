using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType]
    public class Section : TextElement {
        [XmlAttribute]
        public string Key { get; set; }

        [XmlAttribute]
        public string Title { get; set; }

        [XmlElement(typeof(Heading))]
        [XmlElement("Text", typeof(TextRun))]
        [XmlElement(typeof(Paragraph))]
        [XmlElement(typeof(List))]
        [XmlElement(typeof(Subsection))]
        [XmlElement(typeof(History))]
        public List<object> Content { get; set; }
    }
}