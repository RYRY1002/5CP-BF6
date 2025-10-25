let timerUI: mod.UIWidget; 

export function SetupTimeUI() {
  mod.AddUIText(
    "Timer", // Name
    mod.CreateVector(0, 53, 0), // Position
    mod.CreateVector(84, 33, 0), // Size
    mod.UIAnchor.TopCenter, // Anchor
    mod.GetUIRoot(), // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(.8, .8, .8), // Background Color
    1, // Background Alpha
    mod.UIBgFill.Blur, // Background Fill
    mod.Message(
      mod.stringkeys.ui.timer,
      mod.Floor(mod.Divide(mod.GetMatchTimeRemaining(), 60)),
      mod.Floor(mod.Divide(mod.Modulo(mod.GetMatchTimeRemaining(), 60), 10)),
      mod.Floor(mod.Modulo(mod.GetMatchTimeRemaining(), 10))
    ), // Message
    26, // Font Size
    mod.CreateVector(1, 1, 1), // Font Color
    1, // Font Alpha
    mod.UIAnchor.Center
  );
  timerUI = mod.FindUIWidgetWithName("Timer", mod.GetUIRoot());
}

export function UpdateTimeUI(timeRemaining?: number) {
  if (timeRemaining === undefined) {
    timeRemaining = mod.GetMatchTimeRemaining();
  }

  mod.SetUITextLabel(
    timerUI,
    mod.Message(
      mod.stringkeys.ui.timer,
      mod.Floor(mod.Divide(timeRemaining, 60)),
      mod.Floor(mod.Divide(mod.Modulo(timeRemaining, 60), 10)),
      mod.Floor(mod.Modulo(timeRemaining, 10))
    )
  );
}