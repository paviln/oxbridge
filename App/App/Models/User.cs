using System;

namespace Oxbridge.App.Models
{
    public class User : ISerializable
    {
        public String EmailUsername { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Password { get; set; }
        public String Token { get; set; }


    }
}
