using System;
using System.Collections.Generic;
using Oxbridge.App.Data;
using Oxbridge.App.Models;
using Oxbridge.App.Services;
using Xunit;

namespace XUnitAndroid
{
    public class XUnitTest
    {

        #region -- Local variables --
        private ServerClient serverClient;

        private DataController dataController;

        private const int testEventRegId = 2;

        private const double testLongtitude = 10.038299;

        private const double testLatitude = 54.928011;

        private const String username = "hans.hansen@gmail.com";

        private const String password = "hans1234";
        #endregion

        public XUnitTest()
        {
            serverClient = new ServerClient();
            dataController = new DataController();
        }

        /// <summary>
        /// Tests if a Location can be posted to the backend
        /// </summary>
        [Fact]
        public void TestRegisterLocation()
        {
            dataController.SaveUser(serverClient.Login(username, password));

            Location location = new Location
            {
                EventRegId = testEventRegId,
                LocationTime = DateTime.Now,
                Longtitude = testLongtitude,
                Latitude = testLatitude
            };

            bool isSucces = serverClient.PostData(location, Target.Locations).Result;

            Assert.True(isSucces);
        }

        /// <summary>
        /// Tests if live locations can be recieved from the backend
        /// </summary>
        [Fact]
        public void TestGetLiveLocations()
        {
            List<ShipLocation> shipLocations = serverClient.GetLiveLocations(testEventRegId);

            Assert.NotNull(shipLocations);
        }

        /// <summary>
        /// Tests the calculation of direction / angle between two points
        /// </summary>
        /// <param name="firstLongtitude"></param>
        /// <param name="firstLatitude"></param>
        /// <param name="secondLongtitude"></param>
        /// <param name="secondLatitude"></param>
        /// <param name="expected">Expected angle as a double</param>
        [Theory]
        [InlineData(10.056691, 54.934157, 10.071471, 54.947698, 74.1677586635005)]
        [InlineData(10.026863, 54.987846, 10.014122, 54.988187, 311.4835051025)]
        public void TestCalculateDirection(double firstLongtitude, double firstLatitude, double secondLongtitude, double secondLatitude, double expected)
        {
            Location firstLocation = new Location { Longtitude = firstLongtitude, Latitude = firstLatitude };
            Location secondLocation = new Location { Longtitude = secondLongtitude, Latitude = secondLatitude };

            double actual = CalculateDirection(firstLocation, secondLocation);

            Assert.Equal(expected, actual, 4);
        }

        /// <summary>
        /// The method which calculates the angle between two Locations, taken from the MapViewModel
        /// </summary>
        /// <param name="firstLocation"></param>
        /// <param name="secondLocation"></param>
        /// <returns>Returns the angle as a double</returns>
        public double CalculateDirection(Location firstLocation, Location secondLocation)
        {
            if (firstLocation != null & secondLocation != null)
            {
                double angle = (Math.Atan2(secondLocation.Latitude - firstLocation.Latitude, secondLocation.Longtitude - firstLocation.Longtitude)) * 100;
                if (angle < 0)
                {
                    angle = angle * -1;
                }
                return angle;
            }
            else
            {
                return 0;
            }
        }
        /// <summary>
        /// Tests if a ResetPassword can be posted to the backend
        /// </summary>
        [Fact]
        public void TestResetPassword()
        {
            
        }
    }
}