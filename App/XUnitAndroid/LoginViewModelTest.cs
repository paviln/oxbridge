using Xunit;
using FluentAssertions;
using Oxbridge.App.ViewModels;

namespace XUnitAndroid
{
    public class LoginViewModelTest
    {
        private LoginViewModel viewModel;
        [Fact]
        public void Can_Execute_ResetPasswordCommand()
        {
            viewModel = new LoginViewModel();
            var result = viewModel.ResetPasswordCommand.CanExecute(null);

            result.Should().BeTrue();
        }
    }
}