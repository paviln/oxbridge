using System;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace Oxbridge.App.Models
{
    public class SliderButton : AbsoluteLayout
    {

        #region -- Public properties --
        public static readonly BindableProperty ThumbProperty =
            BindableProperty.Create(
                "Thumb", typeof(View), typeof(SliderButton),
                defaultValue: default(View));

        public View Thumb
        {
            get { return (View)GetValue(ThumbProperty); }
            set { SetValue(ThumbProperty, value); }
        }

        public static readonly BindableProperty TrackBarProperty =
            BindableProperty.Create(
                "TrackBar", typeof(View), typeof(SliderButton),
                defaultValue: default(View));

        public View TrackBar
        {
            get { return (View)GetValue(TrackBarProperty); }
            set { SetValue(TrackBarProperty, value); }
        }

        public static readonly BindableProperty FillBarProperty =
            BindableProperty.Create(
                "FillBar", typeof(View), typeof(SliderButton),
                defaultValue: default(View));

        public View FillBar
        {
            get { return (View)GetValue(FillBarProperty); }
            set { SetValue(FillBarProperty, value); }
        }

        #endregion
        #region -- Local variables --
        private PanGestureRecognizer panGesture = new PanGestureRecognizer();
        private View gestureListener;

        private const double _fadeEffect = 0.5;
        private const uint _animLength = 50;
        #endregion

        #region -- Eventhandlers --
        public event EventHandler SlideCompleted;
        #endregion


        public SliderButton()
        {
            panGesture.PanUpdated += OnPanGestureUpdated;
            SizeChanged += OnSizeChanged;

            gestureListener = new ContentView { BackgroundColor = Color.White, Opacity = 0.05 };
            gestureListener.GestureRecognizers.Add(panGesture);
        }

        /// <summary>
        /// Handles the animation of a SliderButton
        /// </summary>
        /// <param name="sender">The SliderButton in question</param>
        /// <param name="e">The PanUpdatedEventArgs of the event</param>
        async void OnPanGestureUpdated(object sender, PanUpdatedEventArgs e)
        {
            if (Thumb == null || TrackBar == null || FillBar == null)
                return;

            switch (e.StatusType)
            {
                case GestureStatus.Started:
                    await TrackBar.FadeTo(_fadeEffect, _animLength);
                    break;

                case GestureStatus.Running:
                    // Translate and ensure we don't pan beyond the wrapped user interface element bounds.
                    var x = Math.Max(0, e.TotalX);
                    if (x > (Width - Thumb.Width))
                        x = (Width - Thumb.Width);

                    Thumb.TranslationX = x;
                    SetLayoutBounds(FillBar, new Rectangle(0, 0, x + Thumb.Width / 2, this.Height));
                    break;

                case GestureStatus.Completed:
                    var posX = Thumb.TranslationX;
                    SetLayoutBounds(FillBar, new Rectangle(0, 0, 0, this.Height));

                    // Reset translation applied during the pan  
                    await Task.WhenAll(new Task[]{
                    TrackBar.FadeTo(1, _animLength),
                    Thumb.TranslateTo(0, 0, _animLength * 2, Easing.CubicIn),
                });

                    if (posX >= (Width - Thumb.Width - 10/* keep some margin for error*/))
                        SlideCompleted?.Invoke(this, EventArgs.Empty);
                    break;
            }
        }

        /// <summary>
        /// An Eventhandler that handles, when the size changes
        /// </summary>
        /// <param name="sender">The SliderButton of which the size is changed</param>
        /// <param name="e">The EventArgs of the event</param>
        void OnSizeChanged(object sender, EventArgs e)
        {
            if (Width == 0 || Height == 0)
                return;
            if (Thumb == null || TrackBar == null || FillBar == null)
                return;


            Children.Clear();

            SetLayoutFlags(TrackBar, AbsoluteLayoutFlags.SizeProportional);
            SetLayoutBounds(TrackBar, new Rectangle(0, 0, 1, 1));
            Children.Add(TrackBar);

            SetLayoutFlags(FillBar, AbsoluteLayoutFlags.None);
            SetLayoutBounds(FillBar, new Rectangle(0, 0, 0, this.Height));
            Children.Add(FillBar);

            SetLayoutFlags(Thumb, AbsoluteLayoutFlags.None);
            SetLayoutBounds(Thumb, new Rectangle(0, 0, this.Width / 5, this.Height));
            Children.Add(Thumb);

            SetLayoutFlags(gestureListener, AbsoluteLayoutFlags.SizeProportional);
            SetLayoutBounds(gestureListener, new Rectangle(0, 0, 1, 1));
            Children.Add(gestureListener);
        }
    }
}
