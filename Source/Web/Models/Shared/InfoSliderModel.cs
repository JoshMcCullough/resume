using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSM.Web.Models.Shared {
    public class InfoSliderModel {
        public string Id { get; set; }
        public string CssClass { get; set; }
        public string Label { get; set; }
        public string Content { get; set; }
        public string Hint { get; set; }
    }
}