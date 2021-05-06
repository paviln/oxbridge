using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Java.Lang;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Oxbridge.App.Models;
using Oxbridge.App.ViewModels.Popups;
using Xamarin.Essentials;
using Xamarin.Forms;
using String = Java.Lang.String;
using Oxbridge.App.Services;
using Resource = TheOxbridgeApp.Droid.Resource;

namespace Oxbridge.App.Droid
{
    [Service]
    public class TrackingService : Service
    {
        #region -- Local variables -- 
        private const int SERVICE_RUNNING_NOTIFICATION_ID = 10000;
        private const string PRIMARY_NOTIF_CHANNEL = "TrackChannel";
        private bool isRunning;
        #endregion

        public override IBinder OnBind(Intent intent)
        {
            return null;
        }

        /// <summary>
        /// Start or stops the TrackingService
        /// </summary>
        /// <param name="intent">Intent to either start or stop the TrackingService</param>
        /// <param name="flags"></param>
        /// <param name="startId"></param>
        /// <returns></returns>
        public override StartCommandResult OnStartCommand(Intent intent, StartCommandFlags flags, int startId)
        {
            if (intent.Action.Equals("TheOxbridgeApp.action.START_SERVICE"))
            {
                if (!isRunning)
                {
                    isRunning = true;
                    RegisterService();
                    StartService();
                }
            }
            if (intent.Action.Equals("TheOxbridgeApp.action.STOP_SERVICE"))
            {
                Preferences.Set("isTracking", false);
                StopForeground(true);
                StopSelf();
                MessagingCenter.Send<string>("", "TrackingStopped");
                isRunning = false;
            }
            return StartCommandResult.Sticky;


        }

        /// <summary>
        /// Starts tracking in a new Thread
        /// </summary>
        private void StartService()
        {
            Thread thread = new Thread(() =>
            {
                SingletonSharedData sharedData = SingletonSharedData.GetInstance();
                sharedData.TrackingPoupViewModel.Track();

            });
            thread.Start();
        }

        /// <summary>
        /// Creates and starts the ForegroundService
        /// </summary>
        private void RegisterService()
        {
            if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
            {
                var channel = new NotificationChannel(PRIMARY_NOTIF_CHANNEL, "My Service Channel", NotificationImportance.Max)
                {
                    Description = "Foreground Service Channel"
                };

                var notificationManager = (NotificationManager)GetSystemService(NotificationService);
                notificationManager.CreateNotificationChannel(channel);

            }

            var notification = new Notification.Builder(this, PRIMARY_NOTIF_CHANNEL)
           .SetContentTitle("Tracker")
           .SetContentText("App'en tracker din båd")
           .SetSmallIcon(Resource.Drawable.notificationIcon)
           .SetContentIntent(BuildIntentToShowMainActivity())
           .SetOngoing(true)
           .AddAction(BuildStopServiceAction())
           .Build();

            StartForeground(SERVICE_RUNNING_NOTIFICATION_ID, notification);
        }

        /// <summary>
        /// Builds the ability to press the notification to go into the app
        /// </summary>
        /// <returns></returns>
        PendingIntent BuildIntentToShowMainActivity()
        {
            var notificationIntent = new Intent(this, typeof(MainActivity));
            notificationIntent.SetAction("TheOxbridgeApp.action.MAIN_ACTIVITY");
            notificationIntent.SetFlags(ActivityFlags.SingleTop | ActivityFlags.ClearTask);
            notificationIntent.PutExtra("has_service_been_started", true);

            var pendingIntent = PendingIntent.GetActivity(this, 0, notificationIntent, PendingIntentFlags.UpdateCurrent);
            return pendingIntent;
        }

        /// <summary>
        /// Builds the ability to stop the TrackingService by pressing the "Stop Tracking" button on the notification
        /// </summary>
        /// <returns></returns>
        Notification.Action BuildStopServiceAction()
        {
            var stopServiceIntent = new Intent(this, GetType());
            stopServiceIntent.SetAction("TheOxbridgeApp.action.STOP_SERVICE");
            var stopServicePendingIntent = PendingIntent.GetService(this, 0, stopServiceIntent, 0);

            var builder = new Notification.Action.Builder(Android.Resource.Drawable.IcMediaPause, "Stop tracking", stopServicePendingIntent);
            return builder.Build();
        }
    }
}