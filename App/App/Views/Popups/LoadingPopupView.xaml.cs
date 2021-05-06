using Rg.Plugins.Popup.Pages;
using Xamarin.Forms.Xaml;

namespace Oxbridge.App.Views.Popups
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LoadingPopupView : PopupPage
    {
        public LoadingPopupView()
        {
            InitializeComponent();
        }

        protected override bool OnBackgroundClicked()
        {
            return false;
        }

        protected override bool OnBackButtonPressed()
        {
            return false;
        }
    }
}