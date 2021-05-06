using Android.App;
using Android.OS;
using Android.Runtime;
using Android.Support.Design.Widget;
using Android.Views;
using System;
using System.Reflection;
using Xunit.Runners.UI;
using Xunit.Sdk;

namespace XUnitAndroid
{
    [Activity(Label = "@String/app_name", Theme = "@style/AppTheme.NoActionBar", MainLauncher = true)]
    public class MainActivity : RunnerActivity
    {

        protected override void OnCreate(Bundle savedInstanceState)
        {
            AddTestAssembly(Assembly.GetExecutingAssembly());
            AddExecutionAssembly(typeof(ExtensibilityPointFactory).Assembly);
            base.OnCreate(savedInstanceState);
        }
   

        public override void OnRequestPermissionsResult(int requestCode, String[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }
}
