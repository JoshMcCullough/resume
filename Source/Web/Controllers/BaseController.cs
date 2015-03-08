using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSM.Web.Controllers {
    public class BaseController : Controller {
        public static class MessagePriority {
            public const string Info = "info";
            public const string Warning = "warning";
            public const string Error = "error";
        }
    }
}