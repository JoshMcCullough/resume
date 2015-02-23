using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QuantumConcepts.Common.Extensions;

namespace JSM.Web.Controllers
{
    public class ExportController : BaseController
    {
        private const string DownloadVirtualPath = "~/Content/Download/";

        public FileResult PDF()
        {
            string downloadFilename = GetResumeDownloadFilename("pdf");

            return this.File(Server.MapPath("{0}{1}".FormatString(ExportController.DownloadVirtualPath, "Resume.pdf")), MimeMapping.GetMimeMapping(downloadFilename), downloadFilename);
        }

        public static string GetResumeDownloadFilename(string extension) {
            return "Josh McCullough's Resume {0}.{1}".FormatString(DateTime.Now, extension);
        }
    }
}