using System;
using System.Collections.Generic;

namespace Oxbridge.App.Models
{
    public class Event
    {
        public int EventId { get; set; }

        public String Name { get; set; }

        public DateTime EventStart { get; set; }

        public DateTime EventEnd { get; set; }

        public String City { get; set; }

        public String Status { get; set; }

        public DateTime ActualEventStart { get; set; }

        public bool IsLive { get; set; }
        private List<string> messages = new List<string>();
        public List<string> Messages
        {
            get { return messages; }
            set { messages = value; }
        }

    }
}
