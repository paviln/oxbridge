using Xunit;
using FluentAssertions;
using Oxbridge.App.ViewModels;

namespace Test
{
    public class LoginViewModelTest
    {
        private LoginViewModel viewModel;
        [Fact]
        public void Can_Execute_ResetPasswordCommand()
        {
            //Arrange
            viewModel = new LoginViewModel();
            //Act
            var result = viewModel.ResetPasswordCommand.CanExecute(null);
            //Assert
            Assert.True(result);            
        }
    }
}