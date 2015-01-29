using JSM.Web.Models.Shared.Resume;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSM.Web.Controllers {
    public class WorkHistoryController : BaseController {
        public ActionResult Index() {
            return View("Section", Resume.Instance.FindSection("work-history"));
        }
    }
}