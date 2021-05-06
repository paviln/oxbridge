using Rg.Plugins.Popup.Pages;
using System.Threading.Tasks;
using Oxbridge.App.Models;
using Oxbridge.App.ViewModels;
using Oxbridge.App.ViewModels.Popups;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Oxbridge.App.Views.Popups
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TrackingPopupView : PopupPage
    {
        #region -- Local variables -- 
        private TrackingPoupViewModel trackingPoupViewModel;

        private bool isTracking;
        #endregion

        public TrackingPopupView(TrackingEventViewModel trackingEventViewModel, TrackingEvent selectedEvent)
        {
            InitializeComponent();
            trackingPoupViewModel = new TrackingPoupViewModel(trackingEventViewModel, selectedEvent);
            this.BindingContext = trackingPoupViewModel;
            SetupActions();
        }

        private void SetupActions()
        {
            trackingPoupViewModel.StartTrackingAnimation = () =>
            {
                isTracking = true;
                AnimateTracking();
            };

            trackingPoupViewModel.StopTrackingAnimation = () =>
            {
                isTracking = false;
                ViewExtensions.CancelAnimations(trackingImage);

            };
        }

        /// <summary>
        /// Runs animations as long as the app is tracking
        /// </summary>
        /// <returns></returns>
        private async Task AnimateTracking()
        {
            while (isTracking)
            {
                await trackingImage.TranslateTo(trackingImage.X + popupFrame.Width + 20, trackingImage.Y, 2000, Easing.Linear);
                await trackingImage.TranslateTo(trackingImage.X - 100, trackingImage.Y, 1, Easing.Linear);
            }
        }
    }
}