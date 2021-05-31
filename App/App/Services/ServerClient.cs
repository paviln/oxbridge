using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text.Json;
using RestSharp;
using RestSharp.Serializers.SystemTextJson;
using System.Threading.Tasks;
using Oxbridge.App.Data;
using Oxbridge.App.Models;
using Xamarin.Forms;

namespace Oxbridge.App.Services
{
    public class ServerClient
    {
        #region -- Local variables -- 
        private DataController dataController;
        #endregion

        public ServerClient()
        {
            dataController = new DataController();
        }


        /// <summary>
        /// Contacts the backend in order to login and get a token from the backend 
        /// </summary>
        /// <param name="username">The username of the user</param>
        /// <param name="password">The password of the user</param>
        /// <returns>A user with a token</returns>
        public User Login(String username, String password)
        {
            String target = Target.Authenticate;

            String jsonData = "{\"emailUsername\": \"" + username + "\", \"password\": \"" + password + "\" }";
            WebRequest request = WebRequest.Create(target);
            request.Method = "POST";
            request.ContentType = "application/json";

            using (Stream requestStream = request.GetRequestStream())
            {
                using (StreamWriter streamWriter = new StreamWriter(requestStream))
                {
                    streamWriter.Write(jsonData);
                }
            }
            User foundUser = null;
            try
            {
                String responseFromServer = GetResponse(request);
                foundUser = JsonConvert.DeserializeObject<User>(responseFromServer);
            }
            catch (WebException)
            {
            }
            return foundUser;
        }

        /// <summary>
        /// Gets the last 20 locations for each boat in a specific event from the backend 
        /// </summary>
        /// <param name="eventId">The eventId for the event in question</param>
        /// <returns>Returns a List of ShipLocations</returns>
        public List<ShipLocation> GetLiveLocations(int eventId)
        {
            WebRequest request = WebRequest.Create(Target.LiveLocations + eventId);
            request.Method = "GET";
            request.ContentType = "application/json";

            String responseFromServer = GetResponse(request);
            List<ShipLocation> locations = JsonConvert.DeserializeObject<List<ShipLocation>>(responseFromServer);
            return locations;
        }

        /// <summary>
        /// Gets all the events that the logged in user is signed up for from the backend 
        /// </summary>
        /// <returns>A task with a List of TrackingEvents</returns>
        public async Task<List<TrackingEvent>> GetTrackingEvents()
        {
            WebRequest request = WebRequest.Create(Target.EventsFromUsername);
            request.Method = "GET";
            request.ContentType = "application/json";
            request.Headers.Add("x-access-token", (await dataController.GetUser()).Token);

            String responseFromServer = GetResponse(request);
            List<TrackingEvent> events = JsonConvert.DeserializeObject<List<TrackingEvent>>(responseFromServer);

            return events;
        }


        /// <summary>
        /// Gets all events from the backend
        /// </summary>
        /// <returns>A list of Events</returns>
        public List<Event> GetEvents()
        {
            WebRequest request = WebRequest.Create(Target.Events);
            request.Method = "GET";

            String responseFromServer = GetResponse(request);

            List<Event> events = JsonConvert.DeserializeObject<List<Event>>(responseFromServer);
            return events;

        }


        /// <summary>
        /// Gets all locations from all boats in a specific event from the backend
        /// </summary>
        /// <param name="eventId">The eventId for the event in question</param>
        /// <returns>A list of ShipLocations</returns>
        public List<ShipLocation> GetReplayLocations(int eventId)
        {
            try
            {
                WebRequest request = WebRequest.Create(Target.ReplayLocations + eventId);
                request.Method = "GET";
                request.ContentType = "application/json";

                String responseFromServer = GetResponse(request);
                List<ShipLocation> locations = JsonConvert.DeserializeObject<List<ShipLocation>>(responseFromServer);

                return locations;
            }
            catch (Exception)
            {
            }
            return null;
        }

        /// <summary>
        /// Gets a specific Ship from the backend 
        /// </summary>
        /// <param name="ShipId">The ShipId for the ship in question</param>
        /// <returns>A Ship</returns>
        public Ship GetShip(int ShipId)
        {
            WebRequest request = WebRequest.Create(Target.Ships + ShipId);
            request.Method = "GET";
            request.ContentType = "application/json";

            String responseFromServer = GetResponse(request);
            Ship ship = JsonConvert.DeserializeObject<Ship>(responseFromServer);
            return ship;
        }

        /// <summary>
        /// Gets the start and the fininish locations from the backend
        /// </summary>
        /// <param name="eventId">The eventId of the event in question</param>
        /// <returns>A List of RacePoints</returns>
        public List<RacePoint> GetStartAndFinish(int eventId)
        {
            WebRequest request = WebRequest.Create(Target.StartAndFinishPoints + eventId);
            request.Method = "GET";
            request.ContentType = "application/json";

            String responseFromServer = GetResponse(request);
            List<RacePoint> racePoints = JsonConvert.DeserializeObject<List<RacePoint>>(responseFromServer);
            return racePoints;
        }


        /// <summary>
        /// Get all Ships from a specific event from the backend
        /// </summary>
        /// <param name="eventId">The eventId of the event in question</param>
        /// <returns>A List of Ships</returns>
        public List<Ship> GetShipsFromEventId(int eventId)
        {
            WebRequest request = WebRequest.Create(Target.ShipFromEventId + eventId);
            request.Method = "GET";
            request.ContentType = "application/json";

            String responseFromServer = GetResponse(request);
            List<Ship> ships = null;
            if (!responseFromServer.Equals("{}"))
            {
                ships = JsonConvert.DeserializeObject<List<Ship>>(responseFromServer);
            }
            return ships;
        }

        /// <summary>
        /// Gets the response from a request from the backend
        /// </summary>
        /// <param name="request">The request from which you want a response</param>
        /// <returns>A string with the response</returns>
        private String GetResponse(WebRequest request)
        {
            String responseFromServer = "";

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                using (Stream responseStream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(responseStream))

                        responseFromServer = reader.ReadToEnd();
                }

                return responseFromServer;
            }
        }

        /// <summary>
        /// Posts object with the ISerializable interface to a specific target url to the backend
        /// </summary>
        /// <param name="serializable">The ISerializable object that needs to be posted</param>
        /// <param name="target">The target url</param>
        /// <returns>A task with a boolean, true if succes and false if not</returns>
        public async Task<bool> PostData(ISerializable serializable, String target)
        {
            String statusCode = "";
            String jsonData = JsonConvert.SerializeObject(serializable);
            WebRequest request = WebRequest.Create(target);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Headers.Add("x-access-token", (await dataController.GetUser()).Token);

            using (Stream requestStream = request.GetRequestStream())
            {
                using (StreamWriter streamWriter = new StreamWriter(requestStream))
                {
                    streamWriter.Write(jsonData);
                }
            }
            try
            {
                statusCode = GetStatusCode(request);
            }
            catch (Exception)
            {
            }
            if (statusCode.ToLower().Equals("created"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        /// <summary>
        /// Gets the statuscode for a request from the backend
        /// </summary>
        /// <param name="request">The request from which a status code is needed</param>
        /// <returns>A string of the statuscode</returns>
        private String GetStatusCode(WebRequest request)
        {
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                return response.StatusCode.ToString();
            }
        }

        /// <summary>
        /// Get image from ship.
        /// </summary>
        public async Task<Models.Image> GetImage(int shipId)
        {
            var client = new RestClient(Target.StandardAdress);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            client.UseSystemTextJson(options);

            var request = new RestRequest("ships/getImage/" + shipId, Method.GET);

            var response = await client.ExecuteAsync<Models.Image>(request);

            return response.Data;
        }

        /// <summary>
        /// Upload image to ship.
        /// </summary>
        public async Task<bool> UploadImage(int shipId, Models.Image img)
        {
            var client = new RestClient(Target.StandardAdress);

            var request = new RestRequest("ships/uploadImage/", Method.POST);
            request.AddHeader("x-access-token", (await dataController.GetUser()).Token);
            request.AddHeader("Content-Type", "multipart/form-data");
            request.AddParameter("shipId", shipId);
            request.AddFile("image", img.Data.data, "image.jpeg");

            var response = await client.ExecutePostAsync(request);

            return response.IsSuccessful;
        }
    }
}