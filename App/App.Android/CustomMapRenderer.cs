using Android.Content;
using Android.Gms.Maps;
using Android.Gms.Maps.Model;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using Oxbridge.App;
using TheOxbridgeApp.Droid;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Xamarin.Forms;
using Xamarin.Forms.Maps;
using Xamarin.Forms.Maps.Android;
using Oxbridge.App.Droid;
using Resource = TheOxbridgeApp.Droid.Resource;

[assembly: ExportRenderer(typeof(CustomMap), typeof(CustomMapRenderer))]
namespace Oxbridge.App.Droid
{
    public class CustomMapRenderer : MapRenderer, GoogleMap.IInfoWindowAdapter
    {

        #region -- Local variables --
        private List<CustomPin> customPins;
        private SingletonSharedData sharedData;
        private ServerClient serverClient;
        private const int rotationOffset = 30;
        #endregion

        public CustomMapRenderer(Context context) : base(context)
        {
            sharedData = SingletonSharedData.GetInstance();
            serverClient = new ServerClient();
        }

        protected override void OnElementChanged(Xamarin.Forms.Platform.Android.ElementChangedEventArgs<Map> e)
        {
            base.OnElementChanged(e);

            if (e.OldElement != null)
            {
                NativeMap.InfoWindowClick -= OnInfoWindowClick;
            }

            if (e.NewElement != null)
            {
                var formsMap = (CustomMap)e.NewElement;
                customPins = formsMap.CustomPins;
            }
        }

        protected override void OnMapReady(GoogleMap map)
        {
            base.OnMapReady(map);

            NativeMap.InfoWindowClick += OnInfoWindowClick;
            NativeMap.SetInfoWindowAdapter(this);
        }

        /// <summary>
        /// Creates a pin and sets the icon of it according to what type of pin it is. 
        /// If it is a ship pin, it rotates the pin according to the direction of the ship
        /// </summary>
        /// <param name="pin">The pin that will be created</param>
        /// <returns>The MarkerOptions for the pin</returns>
        protected override MarkerOptions CreateMarker(Pin pin)
        {
            var marker = new MarkerOptions();
            marker.SetPosition(new LatLng(pin.Position.Latitude, pin.Position.Longitude));
            marker.SetTitle(pin.Label);
            marker.SetSnippet(pin.Address);
            if (!String.IsNullOrEmpty(pin.Address))
            {
                if (sharedData.SelectedShipId == int.Parse(pin.Address))
                {
                    marker.SetIcon(BitmapDescriptorFactory.FromResource(Resource.Drawable.markedBoatIcon));
                }
                else
                {
                    marker.SetIcon(BitmapDescriptorFactory.FromResource(Resource.Drawable.boaticon));
                }
                marker.SetRotation((sharedData.Direction) - rotationOffset);
            }
            else
            {
                if (pin.Label.ToLower().Equals("startline"))
                {
                    marker.SetIcon(BitmapDescriptorFactory.FromResource(Resource.Drawable.startIconR));
                }
                else if (pin.Label.ToLower().Equals("finishline"))
                {
                    marker.SetIcon(BitmapDescriptorFactory.FromResource(Resource.Drawable.finishiconR));

                }
            }
            return marker;
        }

        void OnInfoWindowClick(object sender, GoogleMap.InfoWindowClickEventArgs e)
        {
            var customPin = GetCustomPin(e.Marker);
            if (customPin == null)
            {
                throw new Exception("Custom pin not found");
            }

            if (!String.IsNullOrWhiteSpace(customPin.ShipId))
            {
                var url = Android.Net.Uri.Parse(customPin.ShipId);
                var intent = new Intent(Intent.ActionView, url);
                intent.AddFlags(ActivityFlags.NewTask);
                Android.App.Application.Context.StartActivity(intent);
            }
        }

        /// <summary>
        /// Gets the ship info from the backend for the CustomPin that has been selected, and sends it via MessagingCenter
        /// </summary>
        /// <param name="marker">The Marker that is selected</param>
        /// <returns>Null</returns>
        public Android.Views.View GetInfoContents(Marker marker)
        {
            var inflater = Android.App.Application.Context.GetSystemService(Context.LayoutInflaterService) as Android.Views.LayoutInflater;
            if (inflater != null)
            {
                var customPin = GetCustomPin(marker);
                if (customPin == null)
                {
                    throw new Exception("Custom pin not found");
                }

                if (customPin.Name.ToLower().Equals("ship"))
                {
                    Ship ship = serverClient.GetShip(int.Parse(customPin.ShipId));
                    sharedData.SelectedShipId = int.Parse(customPin.ShipId);
                    ship.TeamName = customPin.TeamName;
                    MessagingCenter.Send<Ship>(ship, "SelectShip");
                }
               
            }
            return null;
        }

        public Android.Views.View GetInfoWindow(Marker marker)
        {
            return null;
        }

        /// <summary>
        /// Gets a pin from the position of the given Marker
        /// </summary>
        /// <param name="annotation">The Marker with the desired position</param>
        /// <returns>A CustomPin if found and null if not</returns>
        CustomPin GetCustomPin(Marker annotation)
        {
            var position = new Position(annotation.Position.Latitude, annotation.Position.Longitude);
            foreach (var pin in customPins)
            {
                if (pin.Position == position)
                {
                    return pin;
                }
            }
            return null;
        }
    }
}

