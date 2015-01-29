using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType]
    public class Link : TextElement {
        [XmlAttribute]
        public string Url { get; set; }

        [XmlAttribute]
        public bool Internal { get; set; }

        [XmlText(typeof(string))]
        [XmlElement("Text", typeof(TextRun))]
        [XmlElement(typeof(Paragraph))]
        public List<object> Content { get; set; }
    }
}