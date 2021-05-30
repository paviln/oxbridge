using Rg.Plugins.Popup.Services;
using Oxbridge.App.Models;
using Xamarin.Forms;
using System.IO;

namespace Oxbridge.App.ViewModels.Popups
{
    public class ShipPopupViewModel : BaseViewModel
    {

        #region -- Local variables -- 
        #endregion

        #region -- Binding values -- 
        private ImageSource image;
        public ImageSource Image { get { return image; } set { image = value; OnPropertyChanged(); } }
        #endregion

        #region -- Commands -- 
        #endregion

        public ShipPopupViewModel(Ship selectedShip)
        {
            Image = ImageSource.FromStream(() => new MemoryStream(selectedShip.Img.Data.data));

            PopupNavigation.PopAllAsync();
        }
    }
}
