using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType]
    public class ListItem : TextElement {
        [XmlText(typeof(string))]
        [XmlElement(typeof(Heading))]
        [XmlElement("Text", typeof(TextRun))]
        [XmlElement(typeof(Paragraph))]
        [XmlElement(typeof(Link))]
        [XmlElement(typeof(List))]
        public List<object> Content { get; set; }
    }
}