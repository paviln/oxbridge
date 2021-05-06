using System;
using Oxbridge.App.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Oxbridge.App.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TrackingEventView : ContentPage
    {
        public TrackingEventView()
        {
            InitializeComponent();
        }

        private void ContentPage_Appearing(object sender, EventArgs e)
        {
            ((TrackingEventViewModel)this.BindingContext).OnAppearing();

        }
    }
}