using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Oxbridge.App.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MasterDetail : MasterDetailPage
    {
        public MasterDetail()
        {
            InitializeComponent();
            IsPresented = false;


            switch (Device.RuntimePlatform)
            {
                case Device.Android:
                    DetailPage.BackgroundColor = Color.White;
                    break;

                case Device.iOS:
                    DetailPage.BackgroundColor = Color.LightBlue;
                    break;
            }
        }

        public void ClearSelection()
        {
            navigationList.SelectedItem = null;
        }
    }
}