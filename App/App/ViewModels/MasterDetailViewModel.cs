using Rg.Plugins.Popup.Services;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Oxbridge.App.Data;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Oxbridge.App.Views;
using Oxbridge.App.Views.Popups;
using Xamarin.Forms;

namespace Oxbridge.App.ViewModels
{
    class MasterDetailViewModel : BaseViewModel
    {
        #region -- Local variables --
        private SingletonSharedData sharedData;
        private MasterMenuItems selectedItem;
        private DataController dataController;
        private ServerClient serverClient;
        #endregion

        #region -- Binding Values --
        public MasterMenuItems SelectedItem
        {
            get
            {
                return selectedItem;
            }
            set
            {
                selectedItem = value;

                if (selectedItem == null)
                    return;

                ChangeVMCMD.Execute(selectedItem);

                SelectedItem = null;
            }
        }

        private bool isLogOutVisible;

        public bool IsLogOutVisible
        {
            get { return isLogOutVisible; }
            set { isLogOutVisible = value; OnPropertyChanged(); }
        }

        private ObservableCollection<MasterMenuItems> menuItems;

        public ObservableCollection<MasterMenuItems> MenuItems
        {
            get { return menuItems; }
            set { menuItems = value; OnPropertyChanged(); }
        }

        private bool isPresented;
        public bool IsPresented
        {
            get { return isPresented; }
            set { isPresented = value; OnPropertyChanged(); }
        }

        #endregion

        #region -- Commands --
        public ICommand LogOutCMD { get; set; }
        public ICommand HomeClickedCMD { get; set; }

        /// <summary>
        /// Sets SelectedItem to null and navigates to the TargetViewModel of the selected MenuItem
        /// </summary>
        public ICommand ChangeVMCMD => new Command<MasterMenuItems>(async (MasterMenuItems mmi) =>
        {
            IsPresented = false;
            SelectedItem = null;
            ((MasterDetail)(MasterDetailPage)Application.Current.MainPage).ClearSelection();
            await NavigationService.NavigateToAsync(mmi.TargetViewModel);
        });
        #endregion

        public MasterDetailViewModel()
        {
            sharedData = SingletonSharedData.GetInstance();
            dataController = new DataController();
            serverClient = new ServerClient();

            MenuItems = new ObservableCollection<MasterMenuItems>();

            LogOutCMD = new Command(LogOut);
            HomeClickedCMD = new Command(HomeClicked);
            OnAppearing();
        }

        /// <summary>
        /// Sets the MenuItems according to if the user is logged in or not. 
        /// </summary>
        /// <returns></returns>
        public async Task OnAppearing()
        {
            MenuItems.Clear();
            PopupNavigation.PushAsync(new LoadingPopupView());

            User savedUser = await dataController.GetUser();
            if (savedUser != null)
            {
                User user = serverClient.Login(savedUser.Email, savedUser.Password);
                if (user != null)
                {
                    MenuItems.Add(new MasterMenuItems()
                    {
                        Text = "Tracking",
                        ImagePath = "trackingBoatIcon.png",
                        TargetViewModel = typeof(TrackingEventViewModel)
                    });

                    IsLogOutVisible = true;
                }
            }
            else
            {
                MenuItems.Add(new MasterMenuItems()
                {
                    Text = "Team login",
                    ImagePath = "userIcon.png",
                    TargetViewModel = typeof(LoginViewModel)
                });
                IsLogOutVisible = false;

            }

            MenuItems.Add(new MasterMenuItems()
            {
                Text = "Events",
                ImagePath = "eventIcon.png",
                TargetViewModel = typeof(EventViewModel)
            });

            PopupNavigation.PopAllAsync();
        }


        /// <summary>
        /// Deletes the stored user and navigates to the login screen
        /// </summary>
        private void LogOut()
        {
            IsPresented = false;
            DataController dataController = new DataController();
            dataController.DeleteUser();
            OnAppearing();
            NavigationService.NavigateToAsync(typeof(LoginViewModel));
        }

        /// <summary>
        /// Navigates to the WelcomeView
        /// </summary>
        private void HomeClicked()
        {
            IsPresented = false;
            NavigationService.NavigateToAsync(typeof(EventViewModel));
        }
    }
}
