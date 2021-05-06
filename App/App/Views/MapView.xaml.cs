using System;
using System.Collections.Generic;
using System.Linq;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Oxbridge.App.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Maps;
using Xamarin.Forms.Xaml;

namespace Oxbridge.App.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MapView : ContentPage
    {
        #region -- Local variables --
        private SingletonSharedData sharedData;
        #endregion

        public MapView()
        {
            InitializeComponent();
            Map.CustomPins = new List<CustomPin>();
            sharedData = SingletonSharedData.GetInstance();
        }

        /// <summary>
        /// Sets pins and lines on the map and centers around the pin
        /// </summary>
        /// <param name="polyline">Polyline to be set on the map</param>
        /// <param name="pin">Pin to be set on the map</param>
        /// <param name="shipId">ShipId of the ships of which the pin and lines belong</param>
        public void LoadPoints(Polyline polyline, CustomPin pin, int shipId)
        {
            Map.CustomPins.Add(pin);
            Map.Pins.Add(pin);
            Map.MapElements.Add(polyline);

            if (sharedData.SelectedShipId == shipId)
            {
                Map.MoveToRegion(MapSpan.FromCenterAndRadius(pin.Position, Map.VisibleRegion.Radius));
            }
        }

        /// <summary>
        /// Sets pins and lines for the start line and the finish line
        /// </summary>
        /// <param name="pins">List of CustomPins to be placed on the map</param>
        /// <param name="lines">List of PolyLines to be placed on the map</param>
        public void SetUpStartAndFinish(List<CustomPin> pins, List<Polyline> lines)
        {
            bool isMoved = false;
            foreach (CustomPin pin in pins)
            {
                if (!isMoved && pin.Label.ToLower().Equals("startline"))
                {
                    isMoved = true;
                    Map.MoveToRegion(MapSpan.FromCenterAndRadius(pin.Position, Distance.FromKilometers(0.5)));
                }

                Map.CustomPins.Add(pin);
                Map.Pins.Add(pin);
            }

            foreach (Polyline line in lines)
            {
                Map.MapElements.Add(line);
            }
        }

        private void ContentPage_Appearing(object sender, EventArgs e)
        {
            sharedData.isMapDisplayed = true;
            ((MapViewModel)this.BindingContext).OnAppearing();
        }

        /// <summary>
        /// Clears the map of ship lines and pins
        /// </summary>
        public void ClearMap()
        {
            for (int i = 0; i < Map.MapElements.Count; i++)
            {

                if (!Map.MapElements[i].StrokeColor.Equals(Color.Black))
                {
                    Map.MapElements.RemoveAt(i);
                    i--;
                }
            }

            for (int i = 0; i < Map.Pins.Count; i++)
            {

                if (((CustomPin)Map.Pins[i]).Name.ToLower().Equals("ship"))
                {
                    Map.Pins.RemoveAt(i);
                    Map.CustomPins.RemoveAt(i);
                    i--;
                }
            }
        }

        private void ContentPage_Disappearing(object sender, EventArgs e)
        {
            sharedData.isMapDisplayed = false;
        }
    }
}
