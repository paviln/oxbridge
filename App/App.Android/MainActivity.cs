using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using Oxbridge.App.Droid;
using Oxbridge.App.Services;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

//[assembly: Dependency(typeof(MainActivity))]
namespace Oxbridge.App.Droid
{

    [Activity(Label = "TheOxbridgeApp", Icon = "@drawable/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        #region -- Local variables --
        private MainActivity instance;
        #endregion


        protected override void OnCreate(Bundle savedInstanceState)
        {
            TabLayoutResource = Resource.Layout.Tabbar;
            ToolbarResource = Resource.Layout.Toolbar;

            base.OnCreate(savedInstanceState);

            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            Forms.Init(this, savedInstanceState);
            Rg.Plugins.Popup.Popup.Init(this);

            instance = this;


            LoadApplication(new App());

            SetupMessagingCenter();
        }

        /// <summary>
        /// Setting up MessagingCenter subscription to handle request to start and stop TrackingService
        /// </summary>
        private void SetupMessagingCenter()
        {
            MessagingCenter.Unsubscribe<String>(this, "TrackingService");
            MessagingCenter.Subscribe<String>(this, "TrackingService", (value) =>
            {

                if (value == "1")
                {
                    var intent = new Intent(instance, typeof(TrackingService));
                    intent.SetAction("TheOxbridgeApp.action.START_SERVICE");
                    StartForegroundService(intent);
                }
                else
                {
                    var intent = new Intent(instance, typeof(TrackingService));
                    intent.SetAction("TheOxbridgeApp.action.STOP_SERVICE");
                    StopService(intent);
                }
            });
        }


        public override void OnRequestPermissionsResult(int requestCode, String[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }
}