using System;
using System.Threading.Tasks;
using Oxbridge.App.Services;
using Xamarin.Forms;

namespace Oxbridge.App.ViewModels
{
    public abstract class BaseViewModel : BindableObject
    {
        #region -- Local variables --
        protected readonly INavigationService NavigationService;
        internal static String UserName = "";
        #endregion

        public BaseViewModel()
        {
            NavigationService = ViewModelLocator.Resolve<INavigationService>();
        }

        public virtual Task InitializeAsync(object navigationData)
        {
            return Task.FromResult(false);
        }
    }
}
