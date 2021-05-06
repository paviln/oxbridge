using System;
using Xamarin.Forms.Maps;

namespace Oxbridge.App.Models
{
    public class CustomPin : Pin
    {
        public String Name { get; set; }
        public String ShipId { get; set; }

        public String TeamName { get; set; }
    }
}
