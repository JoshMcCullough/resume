using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;
using RazorGenerator.Mvc;

[assembly: WebActivatorEx.PostApplicationStartMethod(typeof(JSM.Web.Startup.RazorGenerator), "Start")]

namespace JSM.Web.Startup {
    public static class RazorGenerator {
        public static void Start() {
            var engine = new PrecompiledMvcEngine(typeof(RazorGenerator).Assembly) {
                UsePhysicalViewsIfNewer = HttpContext.Current.Request.IsLocal
            };

            ViewEngines.Engines.Insert(0, engine);
            VirtualPathFactoryManager.RegisterVirtualPathFactory(engine);
        }
    }
}