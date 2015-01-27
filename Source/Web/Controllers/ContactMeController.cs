using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSM.Web.Controllers
{
    public class ContactMeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetEmail() {
            return this.Json("joshua.mccullough@gmail.com");
        }

        [HttpPost]
        public JsonResult GetPhone() {
            return this.Json("(802) 318-6441");
        }
    }
}