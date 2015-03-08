using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSM.Web.Models.ContactMe {
    public class SendMessageModel {
        [Required]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Subject")]
        public string Subject { get; set; }

        [Required]
        [DataType(DataType.MultilineText)]
        [Display(Name = "Message")]
        public string Message { get; set; }

        public SecurityQuestionModel SecurityQuestion { get; set; }

        public SendMessageModel() {
            this.SecurityQuestion = new SecurityQuestionModel();
        }

        public void LoadSecurityQuestion() {
            this.SecurityQuestion.Random();
        }
    }
}