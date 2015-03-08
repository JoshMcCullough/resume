using JSM.Web.Models.ContactMe;
using QuantumConcepts.Common.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QuantumConcepts.Common.Extensions;
using QuantumConcepts.Common.Mvc.Extensions;

namespace JSM.Web.Controllers {
    public class ContactMeController : BaseController {
        private const string EmailAddress = "me@joshmccullough.me";
        private const string PhoneNumber = "(802) 318-6441";

        public ActionResult Index() {
            SendMessageModel model = new SendMessageModel();

            model.LoadSecurityQuestion();

            return View(model);
        }

        [HttpPost]
        public ActionResult Index(SendMessageModel model) {
            if (this.ModelState.IsValid) {
                try {
                    EmailUtil.SendEmail(model.Email, ContactMeController.EmailAddress, "{0} (via JoshMcCullough.me)".FormatString(model.Subject), model.Message);
                }
                catch (Exception ex) {
                    this.TempData.SetMessage("Sorry, couldn't send your message: {0}".FormatString(ex.Message), MessagePriority.Error);
                    return View("Index", model);
                }

                return RedirectToAction("Thanks");
            }
            else if (!model.SecurityQuestion.IsValid) {
                model.LoadSecurityQuestion();
                this.ModelState.Remove("SecurityQuestion.Key");
            }

            return View("Index", model);
        }

        public ActionResult Thanks() {
            return View();
        }

        [HttpPost]
        public JsonResult GetEmail() {
            return this.Json(ContactMeController.EmailAddress);
        }

        [HttpPost]
        public JsonResult GetPhone() {
            return this.Json(ContactMeController.PhoneNumber);
        }
    }
}