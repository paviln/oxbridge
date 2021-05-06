using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Oxbridge.App.Views;
using Oxbridge.App.Views.Popups;
using Xamarin.Forms;
using Xamarin.Forms.Maps;

namespace Oxbridge.App.ViewModels
{
    public class MapViewModel : BaseViewModel
    {

        #region -- Local variables --
        private ServerClient serverClient;
        private MapView mapView;
        private SingletonSharedData sharedData;
        private List<ShipLocation> replayLocations;

        private int currentIndex;

        private int speed;

        private const int defaultSpeed = 1;

        private bool isPlaying;

        private List<ShipLocation> sortedLocations;

        private const String IsNotFollowingText = "Tryk på en båd for at følge den";
        private const String IsFollowingText = "Du følger";

        private const double timerSpeed = 0.6;

        private const int replayAmount = 20;
        #endregion

        #region -- Binding values --
        private Ship selectedShip;

        public Ship SelectedShip
        {
            get { return selectedShip; }
            set { selectedShip = value; OnPropertyChanged(); }
        }

        private List<ShipLocation> locations;

        public List<ShipLocation> Locations
        {
            get { return locations; }
            set { locations = value; OnPropertyChanged(); }
        }

        private ShipLocation selectedShipFromList;

        public ShipLocation SelectedShipFromList
        {
            get { return selectedShipFromList; }
            set { selectedShipFromList = value; OnPropertyChanged(); OnShipSelected(); }
        }


        private String currentSpeed;

        public String CurrentSpeed
        {
            get { return currentSpeed; }
            set { currentSpeed = value; OnPropertyChanged(); }
        }



        private bool isReplay;

        public bool IsReplay
        {
            get { return isReplay; }
            set { isReplay = value; OnPropertyChanged(); }
        }

        private String imageName;

        public String ImageName
        {
            get { return imageName; }
            set { imageName = value; OnPropertyChanged(); }
        }


        private bool isFollowing;

        public bool IsFollowing
        {
            get { return isFollowing; }
            set { isFollowing = value; OnPropertyChanged(); }
        }

        private String followingText;

        public String FollowingText
        {
            get { return followingText; }
            set { followingText = value; OnPropertyChanged(); }
        }



        #endregion

        #region -- Commands --
        public ICommand StopFollowingCMD { get; set; }

        public ICommand ReplayCMD { get; set; }

        public ICommand SetSpeedCMD { get; set; }

        public ICommand PlayPauseCMD { get; set; }

        #endregion

        public MapViewModel()
        {
            serverClient = new ServerClient();
            sharedData = SingletonSharedData.GetInstance();

            StopFollowingCMD = new Command(StopFollowing);
            SetSpeedCMD = new Command<String>(SetSpeed);
            PlayPauseCMD = new Command(PlayPause);

            InitialSetup();
        }

        /// <summary>
        /// Is setting up the initial values and MessagingCenter subscription
        /// </summary>
        private void InitialSetup()
        {
            speed = defaultSpeed;
            isPlaying = true;
            ImageName = "pauseIcon.png";
            CurrentSpeed = speed + "x";
            MessagingCenter.Subscribe<Ship>(this, "SelectShip", (value) =>
            {
                SelectedShip = value;
                IsFollowing = true;
                FollowingText = IsFollowingText;
            });
        }

        /// <summary>
        /// Stops or start the Device timer
        /// </summary>
        private void PlayPause()
        {
            if (imageName.ToLower().Equals("pauseicon.png"))
            {
                isPlaying = false;
                ImageName = "playICon.png";
            }
            else
            {
                ImageName = "pauseIcon.png";
                isPlaying = true;
                Device.StartTimer(TimeSpan.FromSeconds(timerSpeed), LoadPoints);
            }
        }

        /// <summary>
        /// Sets the speed to the specified number
        /// </summary>
        /// <param name="speed">The speed which is wanted</param>
        private void SetSpeed(String speed)
        {
            this.speed = int.Parse(speed);
            CurrentSpeed = speed + "x";
        }

        /// <summary>
        /// Initializes the viewing of an event 
        /// </summary>
        public async void OnAppearing()
        {
            IsFollowing = false;
            FollowingText = IsNotFollowingText;

            MasterDetail masterdetail = ((MasterDetail)Application.Current.MainPage);
            NavigationPage navigationPage = (NavigationPage)masterdetail.Detail;
            mapView = (MapView)navigationPage.CurrentPage;

            isPlaying = true;
            SetUpStartAndFinish();

            if (sharedData.HasSelectedDifferentEvent)
            {
                currentIndex = 0;
            }

            switch (sharedData.SelectedEvent.Status.ToLower())
            {
                case "genudsendelse":
                    await Replay();
                    break;
                case "direkte":
                    Live();
                    break;
            }
        }

        /// <summary>
        /// Makes CustomPins and PolyLines to represent the startline and finishline
        /// </summary>
        private void SetUpStartAndFinish()
        {
            List<RacePoint> racePoints = serverClient.GetStartAndFinish(sharedData.SelectedEvent.EventId);

            List<CustomPin> pins = new List<CustomPin>();
            List<Polyline> lines = new List<Polyline>();
            foreach (RacePoint racePoint in racePoints)
            {
                CustomPin firstPin = new CustomPin
                {
                    Type = PinType.Place,
                    Position = new Position(racePoint.FirstLatitude, racePoint.FirstLongtitude),
                    Label = racePoint.Type,
                    Address = "",
                    Name = ""
                };

                CustomPin secondPin = new CustomPin
                {
                    Type = PinType.Place,
                    Position = new Position(racePoint.SecondLatitude, racePoint.SecondLongtitude),
                    Label = racePoint.Type,
                    Address = "",
                    Name = ""
                };

                Polyline polyline = new Polyline
                {
                    StrokeWidth = 8,
                    StrokeColor = Color.Black
                };

                polyline.Geopath.Add(new Position(racePoint.FirstLatitude, racePoint.FirstLongtitude));
                polyline.Geopath.Add(new Position(racePoint.SecondLatitude, racePoint.SecondLongtitude));


                pins.Add(firstPin);
                pins.Add(secondPin);
                lines.Add(polyline);
            }
            mapView.SetUpStartAndFinish(pins, lines);
        }

        /// <summary>
        /// Starts a Device Timer
        /// </summary>
        public void Live()
        {
            IsReplay = false;
            Device.StartTimer(TimeSpan.FromSeconds(timerSpeed), LoadPoints);
        }

        /// <summary>
        /// Loads all locations from the event and starts a Device Timer
        /// </summary>
        /// <returns></returns>
        public async Task Replay()
        {
            await PopupNavigation.PushAsync(new LoadingPopupView()).ConfigureAwait(false);
            IsReplay = true;
            if (sharedData.HasSelectedDifferentEvent)
            {
                replayLocations = serverClient.GetReplayLocations(sharedData.SelectedEvent.EventId);
            }
            await PopupNavigation.PopAllAsync().ConfigureAwait(false);
            Device.StartTimer(TimeSpan.FromSeconds(timerSpeed), LoadPoints);
        }


        /// <summary>
        /// If it is a replay, it will go through a specific number of locations from the replayLocations List for each ship
        /// If it is live, it will get the live locations from the backend and go throught them for each ship
        /// </summary>
        /// <returns></returns>
        private bool LoadPoints()
        {
            if (isPlaying)
            {
                mapView.ClearMap();

                sortedLocations = new List<ShipLocation>();

                if (isReplay)
                {
                    foreach (ShipLocation shipLocation in replayLocations)
                    {
                        int amount = replayAmount;

                        if (currentIndex + replayAmount > shipLocation.LocationsRegistrations.Count)
                        {
                            amount = shipLocation.LocationsRegistrations.Count - (currentIndex + 1);
                        }
                        if (amount > 0)
                        {
                            sortedLocations.Add(new ShipLocation { ShipId = shipLocation.ShipId, LocationsRegistrations = new List<Location>(), TeamName = shipLocation.TeamName });

                            RegisterReplay(shipLocation, currentIndex, amount);
                        }
                    }
                    currentIndex += speed;

                    if (sortedLocations.Count > 1)
                    {
                        sortedLocations.Sort((a, b) => (a.LocationsRegistrations.Last().RaceScore < b.LocationsRegistrations.Last().RaceScore ? 1 : -1));
                            Console.WriteLine("Count = " + sortedLocations.Count);

                        for (int i = 0; i < sortedLocations.Count; i++)
                        {
                            sortedLocations[i].Placement = i + 1;
                        }
                    }
                    Locations = sortedLocations;

                }
                else
                {
                    Locations = serverClient.GetLiveLocations(sharedData.SelectedEvent.EventId);
                    foreach (ShipLocation shipLocation in Locations)
                    {
                        RegisterLive(shipLocation);
                    }
                }
                if (sharedData.isMapDisplayed)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }


        /// <summary>
        /// Makes CustomPins and Polylines for each location 
        /// </summary>
        /// <param name="shipLocation">The ShipLocation object that will be made CustomPins and Polylines according to</param>
        /// <param name="currentIndex">The current number of locations already gone through</param>
        /// <param name="amount">The amount of locations to go through</param>
        private void RegisterReplay(ShipLocation shipLocation, int currentIndex, int amount)
        {
            if (amount > 0)
            {
                ColorTypeConverter colorTypeConverter = new ColorTypeConverter();

                int lastIndex = currentIndex + amount - 1;

                Location lastLocation = shipLocation.LocationsRegistrations.ElementAt(lastIndex);
                Location firstLocation = shipLocation.LocationsRegistrations.ElementAt(currentIndex);


                if (shipLocation.LocationsRegistrations.Count != 0)
                {
                    Polyline polyline = new Polyline
                    {
                        StrokeWidth = 8,
                        StrokeColor = (Color)colorTypeConverter.ConvertFromInvariantString(shipLocation.Color)
                    };
                    for (int i = currentIndex; i < currentIndex + amount; i++)
                    {
                        Location currentLocationRegistration = shipLocation.LocationsRegistrations[i];
                        polyline.Geopath.Add(new Position(currentLocationRegistration.Latitude, currentLocationRegistration.Longtitude));
                        ShipLocation sortedLocation = sortedLocations.Where(l => l.ShipId == shipLocation.ShipId).FirstOrDefault();
                        sortedLocation.LocationsRegistrations.Add(currentLocationRegistration);
                        sortedLocation.Color = shipLocation.Color;

                    }

                    sharedData.Direction = (float)CalculateDirection(firstLocation, lastLocation);

                    CustomPin pin = new CustomPin
                    {
                        Type = PinType.Place,
                        Position = new Position(polyline.Geopath.ElementAt(amount - 1).Latitude, polyline.Geopath.ElementAt(amount - 1).Longitude),
                        Label = String.Empty,
                        Address = "" + shipLocation.ShipId,
                        Name = "Ship",
                        ShipId = "" + shipLocation.ShipId,
                        TeamName = shipLocation.TeamName
                    };
                    mapView.LoadPoints(polyline, pin, shipLocation.ShipId);
                }
            }
        }

        /// <summary>
        ///  Makes CustomPins and Polylines for each location 
        /// </summary>
        /// <param name="shipLocation"></param>
        private void RegisterLive(ShipLocation shipLocation)
        {
            ColorTypeConverter colorTypeConverter = new ColorTypeConverter();

            Location lastLocation = shipLocation.LocationsRegistrations.ElementAt(0);
            Location firstLocation = shipLocation.LocationsRegistrations.ElementAt(shipLocation.LocationsRegistrations.Count - 1);

            if (shipLocation.LocationsRegistrations.Count != 0)
            {
                Polyline polyline = new Polyline
                {
                    StrokeWidth = 8,
                    StrokeColor = (Color)colorTypeConverter.ConvertFromInvariantString(shipLocation.Color)
                };
                for (int i = 0; i < shipLocation.LocationsRegistrations.Count; i++)
                {
                    Location currentLocationRegistration = shipLocation.LocationsRegistrations[i];
                    polyline.Geopath.Add(new Position(currentLocationRegistration.Latitude, currentLocationRegistration.Longtitude));

                }
                sharedData.Direction = (float)CalculateDirection(firstLocation, lastLocation);

                CustomPin pin = new CustomPin
                {
                    Type = PinType.Place,
                    Position = new Position(polyline.Geopath.ElementAt(0).Latitude, polyline.Geopath.ElementAt(0).Longitude),
                    Label = String.Empty,
                    Address = "" + shipLocation.ShipId,
                    Name = "Ship",
                    ShipId = "" + shipLocation.ShipId,
                    TeamName = shipLocation.TeamName
                };
                mapView.LoadPoints(polyline, pin, shipLocation.ShipId);
            }
        }

        /// <summary>
        /// Calculates the angle between two Locations
        /// </summary>
        /// <param name="firstLocation"></param>
        /// <param name="secondLocation"></param>
        /// <returns>Returns the angle as a double</returns>
        public double CalculateDirection(Location firstLocation, Location secondLocation)
        {
            if (firstLocation != null & secondLocation != null)
            {
                double angle = (Math.Atan2(secondLocation.Latitude - firstLocation.Latitude, secondLocation.Longtitude - firstLocation.Longtitude)) * 100;
                if (angle < 0)
                {
                    angle = angle * -1;
                }
                return angle;
            }
            else
            {
                return 0;
            }
        }

        /// <summary>
        /// Sets the binding values for the selected ship
        /// </summary>
        private void OnShipSelected()
        {
            if (selectedShipFromList != null)
            {
                Ship ship = serverClient.GetShip(selectedShipFromList.ShipId);
                ship.TeamName = selectedShipFromList.TeamName;
                SelectedShip = ship;
                sharedData.SelectedShipId = ship.ShipId;
                IsFollowing = true;
                FollowingText = IsFollowingText;
            }
        }

        /// <summary>
        /// Stops following and clears the selected ship
        /// </summary>
        private void StopFollowing()
        {
            sharedData.SelectedShipId = 0;
            FollowingText = IsNotFollowingText;
            IsFollowing = false;
        }
    }
}
