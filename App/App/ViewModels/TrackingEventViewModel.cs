using Newtonsoft.Json;
using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Oxbridge.App.Data;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Oxbridge.App.Views.Popups;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace Oxbridge.App.ViewModels
{
    public class TrackingEventViewModel : BaseViewModel
    {
        #region -- Local variables -- 
        private ServerClient serverClient;

        private List<TrackingEvent> unHandledEvents;

        private DataController dataController;

        private const int trackingTimeLimit = 31;

        #endregion

        #region -- Binding values -- 
        private ObservableCollection<TrackingEvent> events;

        public ObservableCollection<TrackingEvent> Events
        {
            get { return events; }
            set { events = value; OnPropertyChanged(); }
        }

        private TrackingEvent selectedEvent;

        public TrackingEvent SelectedEvent
        {
            get { return selectedEvent; }
            set { selectedEvent = value; OnPropertyChanged(); NavigateToEvent(); }
        }

        private String searchText;

        public String SearchText
        {
            get { return searchText; }
            set { searchText = value; OnPropertyChanged(); UpdateList(); }
        }

        #endregion

        #region -- Commands -- 

        #endregion


        public TrackingEventViewModel()
        {
            serverClient = new ServerClient();
            dataController = new DataController();
        }

        /// <summary>
        /// Gets all TrackingEvents relating to the logged in user from the backend and sets their status
        /// </summary>
        public async void OnAppearing()
        {
            SelectedEvent = null;
            await PopupNavigation.PushAsync(new LoadingPopupView()).ConfigureAwait(false);

            unHandledEvents = serverClient.GetTrackingEvents().Result;
            SetEventStatus();
            await PopupNavigation.PopAllAsync().ConfigureAwait(false);

        }

        /// <summary>
        /// Updates the list of events according to searchText
        /// </summary>
        private void UpdateList()
        {
            Events = new ObservableCollection<TrackingEvent>(unHandledEvents.Where(e => e.Name.ToLower().Contains(searchText.ToLower()) || e.City.ToLower().Contains(searchText.ToLower())));
        }

        /// <summary>
        /// Sets the status of all TrackingEvents and moves events that is planned for the current day to the top 
        /// </summary>
        private void SetEventStatus()
        {
            DateTime currentTime = DateTime.Now;

            foreach (TrackingEvent currentEvent in unHandledEvents)
            {
                var dateSpan = DateTimeSpan.CompareDates(currentEvent.EventStart, currentTime);

                if (dateSpan.Years >= 1)
                {
                    currentEvent.Status = dateSpan.Years + " år";
                }
                else if (dateSpan.Months == 1)
                {
                    currentEvent.Status = dateSpan.Months + " måned";
                }
                else if (dateSpan.Months > 1)
                {
                    currentEvent.Status = dateSpan.Months + " måneder";

                }
                else if (dateSpan.Days == 1)
                {
                    currentEvent.Status = dateSpan.Days + " dag";
                }
                else if (dateSpan.Days > 1)
                {
                    currentEvent.Status = dateSpan.Days + " dage";
                }
                else if (dateSpan.Hours == 1)
                {
                    currentEvent.Status = dateSpan.Hours + " time";
                }
                else if (dateSpan.Hours > 1)
                {
                    currentEvent.Status = dateSpan.Hours + " timer";
                }

                else if (dateSpan.Minutes == 1)
                {
                    currentEvent.Status = dateSpan.Minutes + " minut";
                }
                else if (dateSpan.Minutes > 1)
                {
                    currentEvent.Status = dateSpan.Minutes + " minutter";
                }
                else if (dateSpan.Minutes < 1)
                {
                    currentEvent.Status = "Mindre end et minut";
                }
                if (currentEvent.IsLive)
                {
                    currentEvent.Status = "Igangværende";
                }
                else if (currentTime > currentEvent.EventStart && currentTime < currentEvent.EventEnd)
                {
                    currentEvent.Status = "Igangværende";
                }
                else if (currentTime > currentEvent.EventStart)
                {
                    currentEvent.Status += " siden";
                }
            }

            unHandledEvents = unHandledEvents.OrderByDescending(e => e.EventStart).ToList();


            int length = unHandledEvents.Count;

            for (int i = 0; i < length; i++)
            {
                if (unHandledEvents[i].EventStart.Date == DateTime.Now.Date)
                {
                    TrackingEvent temp = unHandledEvents[i];
                    unHandledEvents.RemoveAt(i);
                    unHandledEvents.Insert(0, temp);
                }
            }
            TrackingEvent currentlyTrackingEvent = dataController.GetTrackingEvent().Result;
            if (currentlyTrackingEvent != null)
            {
                TrackingEvent eventResult = unHandledEvents.Where(e => e.EventId == currentlyTrackingEvent.EventId).FirstOrDefault();
                eventResult.Status = "Tracker";
            }
            Events = new ObservableCollection<TrackingEvent>(unHandledEvents);

        }


        /// <summary>
        /// Navigates to a PopupPage with the selected event 
        /// </summary>
        private async void NavigateToEvent()
        {
            if (selectedEvent != null)
            {
                if (selectedEvent.IsLive || selectedEvent.Status.ToLower().Equals("tracker") || ((selectedEvent.EventStart.Date == DateTime.Now.Date) && (selectedEvent.EventStart - DateTime.Now).Minutes < trackingTimeLimit))
                {
                    TrackingEvent currentlyTrackingEvent = dataController.GetTrackingEvent().Result;
                if ((currentlyTrackingEvent != null && selectedEvent.EventId == currentlyTrackingEvent.EventId) || !Preferences.Get("isTracking", false))
                {
                        await PopupNavigation.PushAsync(new TrackingPopupView(this, selectedEvent));
                }
                else
                {
                    Application.Current.MainPage.DisplayAlert("Tracking", "Du kan kun track et event af gangen", "Ok");
                }
                }
                else
                {
                    Application.Current.MainPage.DisplayAlert("Tracking", "Du kan først starte tracking 30 minutter før eventet starter", "Ok");
                }
            }
        }

        /// <summary>
        /// Changes the status of an event, when tracking is stopped or started
        /// </summary>
        /// <param name="isTracking"></param>
        public void SetTrackingStatus(bool isTracking)
        {
            TrackingEvent eventResult = Events.Where(e => e.EventId == selectedEvent.EventId).FirstOrDefault();
            if (isTracking)
            {
                eventResult.Status = "Tracker";
                dataController.SaveTrackingEvent(eventResult);
            }
            else
            {
                eventResult.Status = "Tracking stoppet";
                dataController.DeleteTrackingEvent();
            }
        }
    }
}
