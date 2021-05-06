using System;
using Oxbridge.App.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Oxbridge.App.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class EventView : ContentPage
    {
        public EventView()
        {
            InitializeComponent();
        }


        private void ContentPage_Appearing(object sender, EventArgs e)
        {
            ((EventViewModel)this.BindingContext).OnAppearing();
        }
    }
}