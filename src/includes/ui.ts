import { teamBlu, teamRed } from "./constants";

let timerUI: mod.UIWidget; 
const teamBluColor = mod.CreateVector(0.4, 0.73, 0.83);
const teamRedColor = mod.CreateVector(0.9, 0.43, 0.32);
const neutralColor = mod.CreateVector(0.42, 0.42, 0.42);

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

  mod.AddUIContainer(
    "BluTeamBluStaticIndicator", // Name
    mod.CreateVector(-21, 86, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.TopCenter, // Anchor
    mod.GetUIRoot(), // Parent
    true, // Visible
    0, // Padding
    teamBluColor, // Background Color
    1, // Background Alpha
    mod.UIBgFill.Solid, // Background Fill
    teamBlu
  );
  mod.AddUIContainer(
    "RedTeamBluStaticIndicator", // Name
    mod.CreateVector(21, 86, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.TopCenter, // Anchor
    mod.GetUIRoot(), // Parent
    true, // Visible
    0, // Padding
    teamRedColor, // Background Color
    1, // Background Alpha
    mod.UIBgFill.Solid, // Background Fill
    teamBlu
  );

    mod.AddUIContainer(
    "BluTeamRedStaticIndicator", // Name
    mod.CreateVector(-21, 86, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.TopCenter, // Anchor
    mod.GetUIRoot(), // Parent
    true, // Visible
    0, // Padding
    teamRedColor, // Background Color
    1, // Background Alpha
    mod.UIBgFill.Solid, // Background Fill
    teamRed
  );
  mod.AddUIContainer(
    "RedTeamRedStaticIndicator", // Name
    mod.CreateVector(21, 86, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.TopCenter, // Anchor
    mod.GetUIRoot(), // Parent
    true, // Visible
    0, // Padding
    teamBluColor, // Background Color
    1, // Background Alpha
    mod.UIBgFill.Solid, // Background Fill
    teamRed
  );
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

export function SetupCapturePointUI() {
  mod.AddUIContainer(
    "CapturePoint1Container", // Name
    mod.CreateVector(-135, 106, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.TopCenter // Anchor
  );
  mod.AddUIContainer(
    "CapturePoint2Container", // Name
    mod.CreateVector(-67.5, 106, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.TopCenter // Anchor
  );
  mod.AddUIContainer(
    "CapturePoint3Container", // Name
    mod.CreateVector(0, 106, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.TopCenter // Anchor
  );
  mod.AddUIContainer(
    "CapturePoint4Container", // Name
    mod.CreateVector(67.5, 106, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.TopCenter // Anchor
  );
  mod.AddUIContainer(
    "CapturePoint5Container", // Name
    mod.CreateVector(135, 106, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.TopCenter // Anchor
  );

  // Setup for Blu team
  for (let i = 1; i <= 5; i++) {
    mod.AddUIText(
      `CapturePoint${i}BluLabel`, // Name
      mod.CreateVector(0, 0, 0), // Position
      mod.CreateVector(48, 48, 0), // Size
      mod.UIAnchor.Center, // Anchor
      mod.FindUIWidgetWithName(`CapturePoint${i}Container`), // Parent
      true, // Visible
      0, // Padding
      teamBluColor, // Background Color
      1, // Background Alpha
      mod.UIBgFill.Solid, // Background Fill
      mod.Message(mod.stringkeys.ui.capturepoints[`${i}`]), // Message
      32, // Font Size
      mod.CreateVector(1, 1, 1), // Font Color
      1, // Font Alpha
      mod.UIAnchor.Center, // Text Anchor
      teamBlu
    );
  }
  // Setup for Red team
  for (let i = 1; i <= 5; i++) {
    mod.AddUIText(
      `CapturePoint${i}RedLabel`, // Name
      mod.CreateVector(0, 0, 0), // Position
      mod.CreateVector(48, 48, 0), // Size
      mod.UIAnchor.Center, // Anchor
      mod.FindUIWidgetWithName(`CapturePoint${i}Container`), // Parent
      true, // Visible
      0, // Padding
      teamRedColor, // Background Color
      1, // Background Alpha
      mod.UIBgFill.Solid, // Background Fill
      mod.Message(mod.stringkeys.ui.capturepoints[`${i}`]), // Message
      32, // Font Size
      mod.CreateVector(1, 1, 1), // Font Color
      1, // Font Alpha
      mod.UIAnchor.Center, // Text Anchor
      teamRed
    );
  }
}

export function UpdateCapturePointUI(capturePointIndex: number, owningTeam: mod.Team) {
  if (mod.Equals(owningTeam, teamBlu)) {
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      teamBluColor
    );
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      teamRedColor
    );
  }
  else if (mod.Equals(owningTeam, teamRed)) {
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      teamRedColor
    );
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      teamBluColor
    );
  }
  else {
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      neutralColor
    );
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      neutralColor
    );
  }
}