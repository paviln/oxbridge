using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using Oxbridge.App.Models;
using Xamarin.Essentials;

namespace Oxbridge.App.Data
{
    public class DataController
    {
        /// <summary>
        /// Save a user locally and encrypted
        /// </summary>
        /// <param name="user">The user that will be saved</param>
        public async void SaveUser(User user)
        {
            await SecureStorage.SetAsync("User", JsonConvert.SerializeObject(user));
        }


        /// <summary>
        /// Remove the locally stored user
        /// </summary>
        public void DeleteUser()
        {
            SecureStorage.Remove("User");
        }


        /// <summary>
        /// Get the locally stored user if it exist
        /// </summary>
        /// <returns>A Task with a User</returns>
        public async Task<User> GetUser()
        {
            String userJson = await SecureStorage.GetAsync("User");

            if (userJson != null)
            {
                return JsonConvert.DeserializeObject<User>(userJson);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Save a TrackingEvent locally and encrypted
        /// </summary>
        /// <param name="trackingEvent">The TrackingEvent that will be saved</param>
        public async void SaveTrackingEvent(TrackingEvent trackingEvent)
        {
            await SecureStorage.SetAsync("TrackingEvent", JsonConvert.SerializeObject(trackingEvent));
        }


        /// <summary>
        /// Remove the locally stored TrackingEvent
        /// </summary>
        public void DeleteTrackingEvent()
        {
            SecureStorage.Remove("TrackingEvent");
        }


        /// <summary>
        /// Get the locally stored TrackingEvent if it exist
        /// </summary>
        /// <returns>A Task with a TrackingEvent</returns>
        public async Task<TrackingEvent> GetTrackingEvent()
        {
            String trackingEventJson = await SecureStorage.GetAsync("TrackingEvent");

            if (trackingEventJson != null)
            {
                return JsonConvert.DeserializeObject<TrackingEvent>(trackingEventJson);
            }
            else
            {
                return null;
            }
        }
    }
}
