using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    public class TextElement {
        [XmlAttribute]
        public string Class { get; set; }

        [XmlElement("Tag")]
        public List<Tag> Tags { get; set; }
    }
}
