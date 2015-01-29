using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using QuantumConcepts.Common.Extensions;
using System.Globalization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlType]
    public class History : Subsection {
        [XmlAttribute]
        public DateTime StartDate { get; set; }

        [XmlIgnore]
        public DateTime? EndDate { get; set; }

        [XmlAttribute("EndDate")]
        public string EndDateXml {
            get {
                if (this.EndDate.HasValue)
                    return this.EndDate.Value.ToString(Resume.XmlDateTimeFormat);

                return null;
            }
            set {
                DateTime parsed;

                if (DateTime.TryParseExact(value, Resume.XmlDateTimeFormat, CultureInfo.CurrentCulture.DateTimeFormat, DateTimeStyles.AssumeLocal, out parsed))
                    this.EndDate = parsed;
                else
                    this.EndDate = null;
            }
        }

        [XmlIgnore]
        public string DateSpan {
            get {
                string dateFormat = "M/yyyy";
                string start = this.StartDate.ToString(dateFormat);
                string end = (this.EndDate.HasValue ? this.EndDate.Value.ToString(dateFormat) : "Present");
                string span = "{0} - {1}".FormatString(start, end);

                return span;
            }
        }

        [XmlAttribute]
        public string Organization { get; set; }

        [XmlAttribute]
        public string OrganizationWebsite { get; set; }

        [XmlAttribute]
        public string OrganizationLocation { get; set; }

        [XmlAttribute]
        public string Role { get; set; }
    }
}