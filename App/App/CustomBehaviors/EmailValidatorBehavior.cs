using System;
using System.Text.RegularExpressions;
using Xamarin.Forms;

namespace Oxbridge.App.CustomBehaviors
{
    public class EmailValidatorBehavior : BehaviorBase<Entry>
    {
        #region -- Local variables --
        private const String emailRegex = @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
            @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$";
        #endregion

        #region -- Public properties --
        public static readonly BindableProperty IsValidProperty = BindableProperty.Create("IsValid", typeof(bool), typeof(EmailValidatorBehavior), true);

        public bool IsValid
        {
            get { return (bool)base.GetValue(IsValidProperty); }
            set { base.SetValue(IsValidProperty, value); }
        }
        #endregion

        protected override void OnAttachedTo(Entry bindable)
        {
            base.OnAttachedTo(bindable);
            bindable.Unfocused += HandleUnFocused;
            bindable.Focused += HandleFocused;
        }

        /// <summary>
        /// Handles email validation and sets the text to red if wrong 
        /// </summary>
        /// <param name="sender">The entry in question</param>
        /// <param name="e">The eventargs for the event</param>
        void HandleUnFocused(object sender, EventArgs e)
        {
            Entry thisEntry = ((Entry)sender);
            if (!String.IsNullOrEmpty(thisEntry.Text))
            {
                IsValid = (Regex.IsMatch(thisEntry.Text, emailRegex, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250)));
            }
            else
            {
                IsValid = false;
            }
            thisEntry.TextColor = IsValid ? Color.Black : Color.Red;

        }

        /// <summary>
        /// Sets the text to black if the entry is focused 
        /// </summary>
        /// <param name="sender">The entry in question</param>
        /// <param name="e">The eventargs for the event</param>
        void HandleFocused(object sender, EventArgs e)
        {
            ((Entry)sender).TextColor = Color.Black;
        }
        protected override void OnDetachingFrom(Entry bindable)
        {
            base.OnDetachingFrom(bindable);

            bindable.Unfocused -= HandleUnFocused;
            bindable.Focused -= HandleFocused;
        }
    }
}
