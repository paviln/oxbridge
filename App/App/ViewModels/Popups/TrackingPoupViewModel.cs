using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace Oxbridge.App.ViewModels.Popups
{
    public class TrackingPoupViewModel : BaseViewModel
    {
        #region -- Local variables --
        private ServerClient serverClient;
        private SingletonSharedData sharedData;
        private TrackingEventViewModel trackingEventViewModel;
        private TrackingEvent selectedEvent;
        private const String StartTrackingText = "Start tracking";
        private const String stopTrackingText = "Stop tracking";
        private const double timerSpeed = 0.6;
        #endregion

        #region -- Actions -- 
        public Action StartTrackingAnimation;
        public Action StopTrackingAnimation;
        #endregion

        #region -- Binding values -- 

        private String sliderText;

        public String SliderText
        {
            get { return sliderText; }
            set { sliderText = value; OnPropertyChanged(); }
        }
        #endregion

        #region -- Commands -- 
        public ICommand SlideCompletedCMD { get; set; }
        #endregion


        public TrackingPoupViewModel(TrackingEventViewModel trackingEventViewModel, TrackingEvent selectedEvent)
        {
            serverClient = new ServerClient();
            sharedData = SingletonSharedData.GetInstance();

            sharedData.TrackingPoupViewModel = this;
            this.selectedEvent = selectedEvent;
            this.trackingEventViewModel = trackingEventViewModel;

            SlideCompletedCMD = new Command(SlideCompleted);

            InitializeTrackingText();

            MessagingCenter.Subscribe<String>(this, "TrackingStopped", (value) =>
            {
                StopTracking();
            });
        }

        /// <summary>
        /// Initializes tracking text and animation if app is tracking
        /// </summary>
        private void InitializeTrackingText()
        {
            if (Preferences.Get("isTracking", false))
            {
                Task.Run(async () =>
                {
                    Thread.Sleep(1100);
                    StartTrackingAnimation();
                });
                SliderText = stopTrackingText;
            }
            else
            {
                SliderText = StartTrackingText;
            }
        }

        /// <summary>
        /// Stops tracking, stops the tracking animation and changes the slider text
        /// </summary>
        private void StopTracking()
        {
            SliderText = StartTrackingText;
            StopTrackingAnimation();
            trackingEventViewModel.SetTrackingStatus(false);
            Preferences.Set("isTracking", false);
            MessagingCenter.Send<String>("0", "TrackingService");


        }

        private void StartTracking()
        {
            trackingEventViewModel.SetTrackingStatus(true);
            StartTrackingAnimation();
            Preferences.Set("isTracking", true);
            Preferences.Set("isAppOpen", true);
            SliderText = stopTrackingText;
            MessagingCenter.Send<String>("1", "TrackingService");
        }


        /// <summary>
        /// Starts or stops tracking 
        /// </summary>
        public void SlideCompleted()
        {
            if (sliderText.Equals(StartTrackingText))
            {
                StartTracking();
            }
            else
            {
                StopTracking();
            }
        }

        /// <summary>
        /// Starts a timer to handle tracking 
        /// </summary>
        public void Track()
        {
            Device.StartTimer(TimeSpan.FromSeconds(timerSpeed), HandleTracking);
        }


        /// <summary>
        /// Handles tracking if the app is still set to track
        /// </summary>
        /// <returns>A boolean, true if app should still be tracking and false if not</returns>
        public bool HandleTracking()
        {
            if (Preferences.Get("isTracking", false))
            {
                RegisterLocation();
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Post the location of the device to the backend 
        /// </summary>
        /// <returns></returns>
        public async Task RegisterLocation()
        {
            await Task.Run(async () =>
            {
                Models.Location location = await FindLocation();
                if (location != null)
                {
                    serverClient.PostData(location, Target.Locations);
                }
                else
                {
                    StopTracking();
                }
            });
        }

        /// <summary>
        /// Finds the location of the device
        /// </summary>
        /// <returns>The location of the device as a Models.Location object</returns>
        private async Task<Models.Location> FindLocation()
        {
            Models.Location location = null;
            bool isLocationValid = true;
            GeolocationRequest request = null;
            Xamarin.Essentials.Location position = null;
            await Task.Run(async () =>
            {
                await Device.InvokeOnMainThreadAsync(async () =>
                {
                    try
                    {
                        request = new GeolocationRequest(GeolocationAccuracy.Best);
                        position = await Geolocation.GetLocationAsync(request);
                    }
                    catch (Exception)
                    {
                        Application.Current.MainPage.DisplayAlert("GPS ikke tændt", "Tænd GPS'en på din telefon", "Ok");
                        isLocationValid = false;
                    }

                });
                if (isLocationValid)
                {
                    location = new Models.Location { EventRegId = selectedEvent.EventRegId, Longtitude = position.Longitude, Latitude = position.Latitude, LocationTime = DateTime.Now };
                }
            });
            return location;
        }
    }
}
