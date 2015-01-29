using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType]
    public class Tag {
        [XmlText]
        public string Text { get; set; }
    }
}
