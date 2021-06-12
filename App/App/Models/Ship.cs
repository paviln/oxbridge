using System;

namespace Oxbridge.App.Models
{
    public class Ship
    {
        public int ShipId { get; set; }
        public String Name { get; set; }
        public String EmailUsername { get; set; }
        public String TeamName { get; set; }
        public Image Img { get; set; }
    }
}
