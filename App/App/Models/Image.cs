using Oxbridge.App.Convertors;
using System.Text.Json.Serialization;

namespace Oxbridge.App.Models
{
    public class Image
    {
        public Data Data { get; set; }
        public string ContentType { get; set; }
    }
    public class Data
    {
        [JsonConverter(typeof(ByteArrayConverter))]
        public byte[] data { get; set; }
        public string ContentType { get; set; }
    }
}