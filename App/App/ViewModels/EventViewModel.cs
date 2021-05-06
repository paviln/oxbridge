using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Oxbridge.App.Views.Popups;

namespace Oxbridge.App.ViewModels
{
    public class EventViewModel : BaseViewModel
    {

        #region -- Local variables -- 
        private ServerClient serverClient;

        private List<Event> unHandledEvents;

        #endregion

        #region -- Binding values -- 
        private ObservableCollection<Event> events;

        public ObservableCollection<Event> Events
        {
            get { return events; }
            set { events = value; OnPropertyChanged(); }
        }

        private Event selectedEvent;

        public Event SelectedEvent
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


        public EventViewModel()
        {
            serverClient = new ServerClient();
        }

        /// <summary>
        /// Gets all events from the backend and sets their status
        /// </summary>
        public async void OnAppearing()
        {
            await PopupNavigation.PushAsync(new LoadingPopupView()).ConfigureAwait(false);
            unHandledEvents = serverClient.GetEvents();
            SetEventStatus();
            await PopupNavigation.PopAllAsync().ConfigureAwait(false);
        }

        /// <summary>
        /// Updates the list of events according to searchText
        /// </summary>
        private void UpdateList()
        {
            Events = new ObservableCollection<Event>(unHandledEvents.Where(e => e.Name.ToLower().Contains(searchText.ToLower()) || e.City.ToLower().Contains(searchText.ToLower())));
        }

        /// <summary>
        /// Sets the status of all events and moves events that is planned for the current day to the top 
        /// </summary>
        private void SetEventStatus()
        {
            DateTime currentTime = DateTime.Now;

            foreach (Event currentEvent in unHandledEvents)
            {
                if (currentEvent.EventEnd < currentTime)
                {
                    currentEvent.Status = "Genudsendelse";
                }
                else if (currentEvent.EventStart > currentTime)
                {
                    currentEvent.Status = "Kommende";
                }
                else if ((currentEvent.EventStart <= currentTime && currentEvent.EventEnd > currentTime))
                {
                    currentEvent.Status = "Direkte";
                }
                if (currentEvent.IsLive)
                {
                    currentEvent.Status = "Direkte";
                }
                else if (!currentEvent.ActualEventStart.ToString().Equals("01-01-0001 00:00:00") && currentEvent.ActualEventStart < currentTime)
                {
                    currentEvent.Status = "Genudsendelse";
                }

            }
            int length = unHandledEvents.Count;
            unHandledEvents = unHandledEvents.OrderByDescending(e => e.EventStart).ToList();

            for (int i = 0; i < length; i++)
            {
                if (unHandledEvents[i].EventStart.Date == DateTime.Now.Date)
                {
                    Event temp = unHandledEvents[i];
                    unHandledEvents.RemoveAt(i);
                    unHandledEvents.Insert(0, temp);
                }
            }
            Events = new ObservableCollection<Event>(unHandledEvents);
        }


        /// <summary>
        /// Navigates to a PopupPage with the selected event 
        /// </summary>
        private async void NavigateToEvent()
        {
            if (selectedEvent != null)
            {
                Event tempSelectedEvent = selectedEvent;
                SelectedEvent = null;
                await PopupNavigation.PushAsync(new LoadingPopupView());
                await PopupNavigation.PushAsync(new EventPopupView(tempSelectedEvent));
            }
        }
    }
}
