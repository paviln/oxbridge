using Newtonsoft.Json;
using System;

namespace Oxbridge.App.Models
{
    public class Location : ISerializable
    {
        [JsonProperty("regId")]
        public int RegId { get; set; }

        [JsonProperty("eventRegId")]
        public int EventRegId { get; set; }

        [JsonProperty("locationTime")]
        public DateTime LocationTime { get; set; }

        [JsonProperty("longtitude")]
        public double Longtitude { get; set; }

        [JsonProperty("latitude")]
        public double Latitude { get; set; }

        [JsonProperty("raceScore")]
        public decimal RaceScore { get; set; }
    }
}
