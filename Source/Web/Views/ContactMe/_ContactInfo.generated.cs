﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.0
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ASP
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Optimization;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    using JSM.Web;
    
    #line 1 "..\..\Views\ContactMe\_ContactInfo.cshtml"
    using JSM.Web.Models.Shared;
    
    #line default
    #line hidden
    using QuantumConcepts.Common.Extensions;
    using QuantumConcepts.Common.Mvc.Extensions;
    using QuantumConcepts.Common.Mvc.Utils;
    using QuantumConcepts.Common.Web.Extensions;
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Views/ContactMe/_ContactInfo.cshtml")]
    public partial class _Views_ContactMe__ContactInfo_cshtml : System.Web.Mvc.WebViewPage<dynamic>
    {
        public _Views_ContactMe__ContactInfo_cshtml()
        {
        }
        public override void Execute()
        {
WriteLiteral("\r\n<p>If you\'d like to get in touch with me, please use one of the following metho" +
"ds:</p>\r\n\r\n");

            
            #line 5 "..\..\Views\ContactMe\_ContactInfo.cshtml"
  Html.RenderPartial("_InfoSlider", new InfoSliderModel() {
    Id = "emailSlider",
    Label = "Email"
});
            
            #line default
            #line hidden
WriteLiteral("\r\n\r\n");

            
            #line 10 "..\..\Views\ContactMe\_ContactInfo.cshtml"
  Html.RenderPartial("_InfoSlider", new InfoSliderModel() {
    Id = "phoneSlider",
    Label = "Phone"
});
            
            #line default
            #line hidden
WriteLiteral("\r\n\r\n<script");

WriteLiteral(" type=\"text/javascript\"");

WriteLiteral(@">
    function sliderCallback(url, contentCallback) {
        var $sliderElement = this;

        $.post(url, function (data) {
            var infoSlider = $sliderElement.getInfoSlider();

            infoSlider.onSliding = null;
            infoSlider.setContent(contentCallback instanceof Function ? contentCallback(data) : data);
        });
    }

    function emailSliderCallback() {
        var $emailSlider = $(""#emailSlider"");

        sliderCallback.call($emailSlider, """);

            
            #line 30 "..\..\Views\ContactMe\_ContactInfo.cshtml"
                                      Write(Url.Action("GetEmail", "ContactMe"));

            
            #line default
            #line hidden
WriteLiteral(@""", function (data) {
            return $(""<a>"")
                .text(data)
                .attr(""href"", ""mailto:"" + data);
        });
    }

    function phoneSliderCallback() {
        var $phoneSlider = $(""#phoneSlider"");

        sliderCallback.call($phoneSlider, """);

            
            #line 40 "..\..\Views\ContactMe\_ContactInfo.cshtml"
                                      Write(Url.Action("GetPhone", "ContactMe"));

            
            #line default
            #line hidden
WriteLiteral(@""");
    }

    $(document).ready(function () {
        var $emailSlider = $(""#emailSlider"");
        var $phoneSlider = $(""#phoneSlider"");

        $emailSlider.infoSlider(emailSliderCallback);
        $phoneSlider.infoSlider(phoneSliderCallback);

        $(document).one(""click keydown scroll"", function () {
            emailSliderCallback();
            phoneSliderCallback();
        });
    });
</script>");

        }
    }
}
#pragma warning restore 1591
