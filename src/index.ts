import * as modlib from "modlib";
import { capturePoint1, capturePoint2, capturePoint3, capturePoint4, capturePoint5, teamRed, teamBlu } from "./includes/constants";

let firstCapComplete = false;

export async function OnGameModeStarted(): Promise<void> {
	mod.EnableGameModeObjective(capturePoint1, false);
	mod.EnableGameModeObjective(capturePoint2, false);
	mod.EnableGameModeObjective(capturePoint3, true);
	mod.EnableGameModeObjective(capturePoint4, false);
	mod.EnableGameModeObjective(capturePoint5, false);

	mod.SetMaxCaptureMultiplier(capturePoint1, 4);
	mod.SetMaxCaptureMultiplier(capturePoint2, 4);
	mod.SetMaxCaptureMultiplier(capturePoint3, 4);
	mod.SetMaxCaptureMultiplier(capturePoint4, 4);
	mod.SetMaxCaptureMultiplier(capturePoint5, 4);

	mod.SetCapturePointNeutralizationTime(capturePoint1, 2);
	mod.SetCapturePointNeutralizationTime(capturePoint5, 2);

	mod.SetCapturePointNeutralizationTime(capturePoint2, 12);
	mod.SetCapturePointNeutralizationTime(capturePoint4, 12);

	mod.SetCapturePointNeutralizationTime(capturePoint3, 0);

	mod.SetCapturePointCapturingTime(capturePoint1, 0);
	mod.SetCapturePointCapturingTime(capturePoint2, 0);
	mod.SetCapturePointCapturingTime(capturePoint3, 24);
	mod.SetCapturePointCapturingTime(capturePoint4, 0);
	mod.SetCapturePointCapturingTime(capturePoint5, 0);
}

export async function OnCapturePointCaptured(eventCapturePoint: mod.CapturePoint): Promise<void> {
	let playersOnPointOnCapturingTeam = modlib.FilteredArray(mod.GetPlayersOnPoint(eventCapturePoint), (player) => {
		return mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), mod.GetTeam(player));
	});
	for (let i = 0; i < mod.CountOf(playersOnPointOnCapturingTeam); i++) {
		mod.PlaySound(104, 1, mod.ValueInArray(playersOnPointOnCapturingTeam, i)); // SFX_UI_Gamemode_Shared_CaptureObjectives_OnCapturedByFriendly_OneShot2D
	}

	if (!firstCapComplete) {
		firstCapComplete = true;
		if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamRed)) {
			mod.EnableGameModeObjective(capturePoint2, true);
		}
		else if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamBlu)) {
			mod.EnableGameModeObjective(capturePoint4, true);
		}

		mod.SetCapturePointNeutralizationTime(capturePoint3, 24);
		mod.SetCapturePointCapturingTime(capturePoint3, 0);
	}

	if (firstCapComplete) {
		if (mod.Equals(eventCapturePoint, capturePoint1)) {
			if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamRed)) {
				mod.EndGameMode(teamRed);
			}
			else if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamBlu)) {
				mod.EnableGameModeObjective(capturePoint2, true);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint2)) {
			if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamRed)) {
				mod.EnableGameModeObjective(capturePoint3, false);
				mod.EnableGameModeObjective(capturePoint1, true);
			}
			else if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamBlu)) {
				mod.EnableGameModeObjective(capturePoint3, true);
				mod.EnableGameModeObjective(capturePoint1, false);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint3)) {
			if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamRed)) {
				mod.EnableGameModeObjective(capturePoint2, true);
				mod.EnableGameModeObjective(capturePoint4, false);
			}
			else if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamBlu)) {
				mod.EnableGameModeObjective(capturePoint2, false);
				mod.EnableGameModeObjective(capturePoint4, true);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint4)) {
			if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamRed)) {
				mod.EnableGameModeObjective(capturePoint3, true);
				mod.EnableGameModeObjective(capturePoint5, false);
			}
			else if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamBlu)) {
				mod.EnableGameModeObjective(capturePoint3, false);
				mod.EnableGameModeObjective(capturePoint5, true);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint5)) {
			if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamRed)) {
				mod.EnableGameModeObjective(capturePoint4, true);
			}
			else if (mod.Equals(mod.GetCurrentOwnerTeam(eventCapturePoint), teamBlu)) {
				mod.EndGameMode(teamBlu);
			}
		}
	}
}

export async function OnPlayerEnterCapturePoint(eventPlayer: mod.Player, eventCapturePoint: mod.CapturePoint): Promise<void> {
	mod.PlaySound(101, 1, eventPlayer); // SFX_UI_Gamemode_Shared_CaptureObjectives_ObjectiveOnEnter_OneShot2D
}

export async function OnPlayerExitCapturePoint(eventPlayer: mod.Player, eventCapturePoint: mod.CapturePoint): Promise<void> {
	mod.PlaySound(102, 1, eventPlayer); // SFX_UI_Gamemode_Shared_CaptureObjectives_ObjectiveOnExit_OneShot2D
}