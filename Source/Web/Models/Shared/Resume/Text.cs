using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType("Text")]
    public class TextRun : TextElement {
        [XmlAttribute]
        public bool Block { get; set; }

        [XmlText(typeof(string))]
        [XmlElement("Text", typeof(TextRun))]
        [XmlElement(typeof(Paragraph))]
        [XmlElement(typeof(Link))]
        [XmlElement(typeof(List))]
        public List<object> Content { get; set; }
    }
}
