using System.Web;
using System.Web.Optimization;

namespace JSM.Web.Startup {
    public class BundleConfig {
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new StyleBundle("~/Content/Stylesheets/Site").Include(
                "~/Content/Stylesheets/Site.css",
                "~/Content/Stylesheets/Site.md.css",
                "~/Content/Stylesheets/Site.sm.css",
                "~/Content/Stylesheets/Site.xs.css",
                "~/Content/Stylesheets/InfoSlider.css"));

            bundles.Add(new StyleBundle("~/Content/Stylesheets/Print").Include(
                "~/Content/Stylesheets/Print.css"));

            bundles.Add(new ScriptBundle("~/Content/Scripts/3rdParty").Include(
                "~/Content/Scripts/jquery-{version}.js",
                "~/Content/Scripts/jquery-ui-{version}.js",
                "~/Content/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/Content/Scripts/Site").Include(
                "~/Content/Scripts/Site.js",
                "~/Content/Scripts/Tags.js",
                "~/Content/Scripts/InfoSlider.js"));

#if !DEBUG
            BundleTable.EnableOptimizations = true;
#endif
        }
    }
}
