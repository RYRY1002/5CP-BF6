import { teamBlu, teamRed } from "./constants";

let anchorWidget: mod.UIWidget; 
let timerWidget: mod.UIWidget;
const teamBluColor = mod.CreateVector(0.439,  0.922,  1);
const teamRedColor = mod.CreateVector(1,      0.514,  0.38);
const neutralColor = mod.CreateVector(0.8,    0.8,    0.8);

export function SetupTimeUI() {
  let timeRemaining = mod.GetMatchTimeRemaining();

  mod.AddUIContainer(
    "Anchor", // Name
    mod.CreateVector(0, 53, 0), // Position
    mod.CreateVector(84, 33, 0), // Size
    mod.UIAnchor.TopCenter, // Anchor
    mod.GetUIRoot(), // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(0, 0, 0), // Background Color
    0, // Background Alpha
    mod.UIBgFill.None // Background Fill
  );
  anchorWidget = mod.FindUIWidgetWithName("Anchor", mod.GetUIRoot());

  mod.AddUIText(
    "Timer", // Name
    mod.CreateVector(0, 0, 0), // Position
    mod.CreateVector(84, 33, 0), // Size
    mod.UIAnchor.TopCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(.8, .8, .8), // Background Color
    1, // Background Alpha
    mod.UIBgFill.Blur, // Background Fill
    mod.Message(
      mod.stringkeys.ui.timer,
      mod.Floor(mod.Divide(timeRemaining, 60)),
      mod.Floor(mod.Divide(mod.Modulo(timeRemaining, 60), 10)),
      mod.Floor(mod.Modulo(timeRemaining, 10))
    ), // Message
    26, // Font Size
    mod.CreateVector(1, 1, 1), // Font Color
    1, // Font Alpha
    mod.UIAnchor.Center // Text Anchor
  );
  timerWidget = mod.FindUIWidgetWithName("Timer", anchorWidget);

  mod.AddUIContainer(
    "BluTeamBluStaticIndicator", // Name
    mod.CreateVector(-21, -6, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    teamBluColor, // Background Color
    1, // Background Alpha
    mod.UIBgFill.Solid, // Background Fill
    teamBlu
  );
  mod.AddUIContainer(
    "RedTeamBluStaticIndicator", // Name
    mod.CreateVector(21, -6, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    teamRedColor, // Background Color
    1, // Background Alpha
    mod.UIBgFill.Solid, // Background Fill
    teamBlu
  );

    mod.AddUIContainer(
    "BluTeamRedStaticIndicator", // Name
    mod.CreateVector(-21, -6, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    teamRedColor, // Background Color
    1, // Background Alpha
    mod.UIBgFill.Solid, // Background Fill
    teamRed
  );
  mod.AddUIContainer(
    "RedTeamRedStaticIndicator", // Name
    mod.CreateVector(21, -6, 0), // Position
    mod.CreateVector(42, 6, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
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
    timerWidget,
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
    "CapturePoint1Anchor", // Name
    mod.CreateVector(-135, -67, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(0, 0, 0), // Background Color
    0, // Background Alpha
    mod.UIBgFill.None // Background Fill
  );
  mod.AddUIContainer(
    "CapturePoint2Anchor", // Name
    mod.CreateVector(-67.5, -67, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(0, 0, 0), // Background Color
    0, // Background Alpha
    mod.UIBgFill.None // Background Fill
  );
  mod.AddUIContainer(
    "CapturePoint3Anchor", // Name
    mod.CreateVector(0, -67, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(0, 0, 0), // Background Color
    0, // Background Alpha
    mod.UIBgFill.None // Background Fill
  );
  mod.AddUIContainer(
    "CapturePoint4Anchor", // Name
    mod.CreateVector(67.5, -67, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(0, 0, 0), // Background Color
    0, // Background Alpha
    mod.UIBgFill.None // Background Fill
  );
  mod.AddUIContainer(
    "CapturePoint5Anchor", // Name
    mod.CreateVector(135, -67, 0), // Position
    mod.CreateVector(48, 48, 0), // Size
    mod.UIAnchor.BottomCenter, // Anchor
    anchorWidget, // Parent
    true, // Visible
    0, // Padding
    mod.CreateVector(0, 0, 0), // Background Color
    0, // Background Alpha
    mod.UIBgFill.None // Background Fill
  );

  // Setup for Blu team
  for (let i = 1; i <= 5; i++) {
    mod.AddUIText(
      `CapturePoint${i}BluLabel`, // Name
      mod.CreateVector(0, 0, 0), // Position
      mod.CreateVector(48, 48, 0), // Size
      mod.UIAnchor.Center, // Anchor
      mod.FindUIWidgetWithName(`CapturePoint${i}Anchor`), // Parent
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
      mod.FindUIWidgetWithName(`CapturePoint${i}Anchor`), // Parent
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
    mod.SetUIWidgetBgFill(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      mod.UIBgFill.Solid
    );

    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      teamRedColor
    );
    mod.SetUIWidgetBgFill(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      mod.UIBgFill.Solid
    );
  }
  else if (mod.Equals(owningTeam, teamRed)) {
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      teamRedColor
    );
    mod.SetUIWidgetBgFill(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      mod.UIBgFill.Solid
    );

    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      teamBluColor
    );
    mod.SetUIWidgetBgFill(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      mod.UIBgFill.Solid
    );
  }
  else {
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      neutralColor
    );
    mod.SetUIWidgetBgFill(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}BluLabel`),
      mod.UIBgFill.Blur
    );
    
    mod.SetUIWidgetBgColor(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      neutralColor
    );
    mod.SetUIWidgetBgFill(
      mod.FindUIWidgetWithName(`CapturePoint${capturePointIndex}RedLabel`),
      mod.UIBgFill.Blur
    );
  }
}