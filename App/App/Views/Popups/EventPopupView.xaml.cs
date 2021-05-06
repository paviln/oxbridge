using Rg.Plugins.Popup.Pages;
using Xamarin.Forms.Xaml;
using Oxbridge.App.ViewModels.Popups;
using Oxbridge.App.Models;


namespace Oxbridge.App.Views.Popups
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class EventPopupView : PopupPage
    {

        public EventPopupView(Event selectedEvent)
        {
            InitializeComponent();
            this.BindingContext = new EventPopupViewModel(selectedEvent);
        }
    }
}