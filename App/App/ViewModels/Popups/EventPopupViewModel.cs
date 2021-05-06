using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Windows.Input;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Xamarin.Forms;

namespace Oxbridge.App.ViewModels.Popups
{
    public class EventPopupViewModel : BaseViewModel
    {

        #region -- Local variables -- 
        private ServerClient serverClient;

        private SingletonSharedData sharedData;
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
        #endregion

        #region -- Commands -- 
        public ICommand NavigateToMapCMD { get; set; }
        #endregion


        public EventPopupViewModel(Event selectedEvent)
        {
            sharedData = SingletonSharedData.GetInstance();
            serverClient = new ServerClient();
            NavigateToMapCMD = new Command(NavigateToMap);
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

    }
}
