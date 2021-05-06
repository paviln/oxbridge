using System;
using Xamarin.Forms;

namespace Oxbridge.App.Models
{
    public class TrackingEvent : BindableObject
    {
        public int EventId { get; set; }

        public String Name { get; set; }

        public DateTime EventStart { get; set; }

        public DateTime EventEnd { get; set; }

        public String City { get; set; }

        private String status;
        public String Status
        {
            get { return status; }
            set { status = value; OnPropertyChanged(); }
        }


        public DateTime ActualEventStart { get; set; }

        public bool IsLive { get; set; }

        public int EventRegId { get; set; }
    }
}
