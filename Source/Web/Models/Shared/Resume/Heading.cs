using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType]
    public class Heading : TextElement {
        [XmlAttribute]
        public int Level { get; set; }

        [XmlText(typeof(string))]
        [XmlElement("Text", typeof(TextRun))]
        [XmlElement(typeof(Link))]
        public List<object> Content { get; set; }
    }
}