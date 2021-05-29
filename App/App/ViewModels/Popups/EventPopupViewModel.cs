using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Windows.Input;
using Xamarin.Essentials;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Xamarin.Forms;
using System.Threading.Tasks;
using Oxbridge.App.Helpers;

namespace Oxbridge.App.ViewModels.Popups
{
    public class EventPopupViewModel : BaseViewModel
    {

        #region -- Local variables -- 
        private ServerClient serverClient;
        private SingletonSharedData sharedData;
        private byte[] file = null;
        #endregion

        #region -- Binding values -- 
        private List<Ship> ships;

        public List<Ship> Ships
        {
            get { return ships; }
            set { ships = value; OnPropertyChanged(); }
        }

        private String eventStatus;

        public String EventStatus
        {
            get { return eventStatus; }
            set { eventStatus = value; OnPropertyChanged(); }
        }

        private Event selectedEvent;

        public Event SelectedEvent
        {
            get { return selectedEvent; }
            set { selectedEvent = value; OnPropertyChanged(); }
        }


        private String startTime;

        public String StartTime
        {
            get { return startTime; }
            set { startTime = value; OnPropertyChanged(); }
        }


        private String endTime;

        public String EndTime
        {
            get { return endTime; }
            set { endTime = value; OnPropertyChanged(); }
        }

        private bool isNavigationVisible;

        public bool IsNavigationVisible
        {
            get { return isNavigationVisible; }
            set { isNavigationVisible = value; OnPropertyChanged(); }
        }

        private ImageSource image;
        public ImageSource Image { get { return image; } set { image = value; OnPropertyChanged(); } }
        #endregion

        #region -- Commands -- 
        public ICommand NavigateToMapCMD { get; set; }
        public ICommand TakePhotoCommand { get; set; }
        #endregion

        public EventPopupViewModel(Event selectedEvent)
        {
            sharedData = SingletonSharedData.GetInstance();
            serverClient = new ServerClient();
            NavigateToMapCMD = new Command(NavigateToMap);
            TakePhotoCommand = new Command(async () => await TakePhotoAsync());
            this.SelectedEvent = selectedEvent;

            SetupBinding();
            PopupNavigation.PopAllAsync();
        }

        /// <summary>
        /// Setting up the binding properties with data
        /// </summary>
        private void SetupBinding()
        {
            EventStatus = selectedEvent.Status;
            Ships = serverClient.GetShipsFromEventId(selectedEvent.EventId);

            if (selectedEvent.Status.ToLower().Equals("kommende"))
            {
                IsNavigationVisible = false;
            }
            else
            {
                IsNavigationVisible = true;
            }
        }

        /// <summary>
        /// Navigates to the MapView and closes the PopupPage
        /// </summary>
        private async void NavigateToMap()
        {
            if (sharedData.SelectedEvent != null)
            {
                if (sharedData.SelectedEvent.EventId == selectedEvent.EventId)
                {
                    sharedData.HasSelectedDifferentEvent = false;
                }
                else
                {
                    sharedData.HasSelectedDifferentEvent = true;

                }
            } else
            {
                sharedData.HasSelectedDifferentEvent = true;
            }
            sharedData.SelectedEvent = selectedEvent;

            await NavigationService.NavigateToAsync(typeof(MapViewModel));
            await PopupNavigation.PopAllAsync();
        }

        private async Task TakePhotoAsync()
        {
            Console.WriteLine("lol");
            try
            {
                var photo = await MediaPicker.CapturePhotoAsync();
                var stream = await photo.OpenReadAsync();
                file = Conversion.StreamToByteArray(stream);
                stream.Position = 0;
                Image = ImageSource.FromStream(() => stream);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CapturePhotoAsync THREW: {ex.Message}");
            }
        }

    }
}
