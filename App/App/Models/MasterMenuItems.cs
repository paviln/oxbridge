using System;


namespace Oxbridge.App.Models
{
    public class MasterMenuItems
    {
        public String Text { get; set; }
        public String Detail { get; set; }
        public String ImagePath { get; set; }
        public Type TargetViewModel { get; set; }
    }
}
