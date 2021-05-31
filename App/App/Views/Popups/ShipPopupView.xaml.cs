using Rg.Plugins.Popup.Pages;
using Xamarin.Forms.Xaml;
using Oxbridge.App.ViewModels.Popups;
using Oxbridge.App.Models;


namespace Oxbridge.App.Views.Popups
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ShipPopupView : PopupPage
    {

        public ShipPopupView(Ship selectedShip)
        {
            InitializeComponent();
            this.BindingContext = new ShipPopupViewModel(selectedShip);
        }
    }
}