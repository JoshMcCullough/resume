using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType]
    public class List : TextElement {
        [XmlAttribute]
        public ListType Type { get; set; }

        [XmlElement("Item")]
        public List<ListItem> Items { get; set; }

        public List() {
            this.Type = ListType.Unordered;
        }
    }
}