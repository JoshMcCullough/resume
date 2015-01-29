using System.Web;
using System.Web.Optimization;

namespace JSM.Web.Startup {
    public class BundleConfig {
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new StyleBundle("~/Content/Stylesheets/3rdParty").Include(
                "~/Content/Stylesheets/bootstrap.css"));

            bundles.Add(new StyleBundle("~/Content/Stylesheets/Site").Include(
                "~/Content/Stylesheets/Site.css"));

            bundles.Add(new StyleBundle("~/Content/Stylesheets/Print").Include(
                "~/Content/Stylesheets/Print.css"));

            bundles.Add(new ScriptBundle("~/Content/Scripts/3rdParty").Include(
                "~/Content/Scripts/jquery-{version}.js",
                "~/Content/Scripts/bootstrap.js",
                "~/Content/Scripts/bigtext.js"));

            bundles.Add(new ScriptBundle("~/Content/Scripts/Site").Include(
                "~/Content/Scripts/Site.js"));

#if !DEBUG
            BundleTable.EnableOptimizations = true;
#endif
        }
    }
}
