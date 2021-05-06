using System;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace Oxbridge.App.Services
{
    public class SettingsService : ISettingsService
    {
        #region -- Local variables -- 
        private const String AccessToken = "access_token";
        private const String IdToken = "id_token";
        private const String IdUseMocks = "use_mocks";
        private readonly String AccessTokenDefault = String.Empty;
        private readonly String IdTokenDefault = String.Empty;
        #endregion

        #region -- Public Properties --
        public String AuthAccessToken
        {
            get => GetValueOrDefault(AccessToken, AccessTokenDefault);
            set => AddOrUpdateValue(AccessToken, value);
        }

        public String AuthIdToken
        {
            get => GetValueOrDefault(IdToken, IdTokenDefault);
            set => AddOrUpdateValue(IdToken, value);
        }
        #endregion


        public Task AddOrUpdateValue(String key, bool value) => AddOrUpdateValueInternal(key, value);
        public Task AddOrUpdateValue(String key, String value) => AddOrUpdateValueInternal(key, value);
        public bool GetValueOrDefault(String key, bool defaultValue) => GetValueOrDefaultInternal(key, defaultValue);
        public String GetValueOrDefault(String key, String defaultValue) => GetValueOrDefaultInternal(key, defaultValue);

        async Task AddOrUpdateValueInternal<T>(String key, T value)
        {
            if (value == null)
            {
                await Remove(key);
            }

            Application.Current.Properties[key] = value;
            try
            {
                await Application.Current.SavePropertiesAsync();
            }
            catch (Exception)
            {
            }
        }

        T GetValueOrDefaultInternal<T>(String key, T defaultValue = default(T))
        {
            object value = null;
            if (Application.Current.Properties.ContainsKey(key))
            {
                value = Application.Current.Properties[key];
            }
            return null != value ? (T)value : defaultValue;
        }

        async Task Remove(String key)
        {
            try
            {
                if (Application.Current.Properties[key] != null)
                {
                    Application.Current.Properties.Remove(key);
                    await Application.Current.SavePropertiesAsync();
                }
            }
            catch (Exception)
            {
            }
        }
    }
}
