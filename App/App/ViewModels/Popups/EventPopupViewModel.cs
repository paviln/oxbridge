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
using Oxbridge.App.Data;
using Oxbridge.App.Views.Popups;

namespace Oxbridge.App.ViewModels.Popups
{
    public class EventPopupViewModel : BaseViewModel
    {

        #region -- Local variables -- 
        private ServerClient serverClient;
        private SingletonSharedData sharedData;
        private DataController dataController;
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

        private Ship selectedShip;

        public Ship SelectedShip
        {
            get { return selectedShip; }
            set { selectedShip = value; OnPropertyChanged(); NavigateToShip(); }
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

        private bool isLeader = false;

        public bool IsLeader
        {
            get { return isLeader; }
            set { isLeader = value; }
        }
        #endregion

        #region -- Commands -- 
        public ICommand NavigateToMapCMD { get; set; }
        public ICommand TakePhotoCommand { get; set; }
        #endregion

        public EventPopupViewModel(Event selectedEvent)
        {
            sharedData = SingletonSharedData.GetInstance();
            serverClient = new ServerClient();
            dataController = new DataController();
            NavigateToMapCMD = new Command(NavigateToMap);
            TakePhotoCommand = new Command(async () => await TakePhotoAsync());
            this.SelectedEvent = selectedEvent;

            SetupBinding();
            PopupNavigation.PopAllAsync();
        }

        /// <summary>
        /// Setting up the binding properties with data
        /// </summary>
        private async void SetupBinding()
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

            var user = await dataController.GetUser();

            if (user != null)
            {
                foreach (var ship in ships)
                {
                    if (ship.EmailUsername.Equals(user.EmailUsername))
                    {
                        IsLeader = true;
                        break;
                    }
                }
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

        /// <summary>
        /// Navigates to a PopupPage with the selected ship
        /// </summary>
        private async void NavigateToShip()
        {
            if (selectedShip != null)
            {
                try
                {
                    Ship tempSelectedShip = selectedShip;
                    SelectedShip = null;
                    var image = await serverClient.GetImage(tempSelectedShip.ShipId);
                    if (image != null)
                    {
                        tempSelectedShip.Img = image;
                        await PopupNavigation.PushAsync(new LoadingPopupView());
                        await PopupNavigation.PushAsync(new ShipPopupView(tempSelectedShip));
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine($"NavigateToShip THREW: {e.Message}");
                }

            }
        }
        //
        // Method for taking a photo and posts it to the api
        //
        private async Task TakePhotoAsync()
        {
            try
            {
                var mediaPicker = await MediaPicker.CapturePhotoAsync();
                var stream = await mediaPicker.OpenReadAsync();
                file = Conversion.StreamToByteArray(stream);

                var data = new Models.Data()
                {
                    data = file
                };
                var img = new Models.Image()
                {
                    Data = data
                };
                await serverClient.UploadImage(SelectedShip.ShipId, img);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CapturePhotoAsync THREW: {ex.Message}");
            }
        }

    }
}
