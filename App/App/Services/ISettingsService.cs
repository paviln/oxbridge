using System;

namespace Oxbridge.App.Services
{
    public interface ISettingsService
    {
        String AuthAccessToken { get; set; }
        String AuthIdToken { get; set; }
    }
}
