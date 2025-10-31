import * as modlib from "modlib";
import { capturePoint1, capturePoint2, capturePoint3, capturePoint4, capturePoint5, teamRed, teamBlu, VOGlobal, VORed, VOBlu, maxCaptureMultiplier,
				 capturePoint1NeutralizationTime, capturePoint2NeutralizationTime, capturePoint3NeutralizationTime, capturePoint4NeutralizationTime, capturePoint5NeutralizationTime,
				 capturePoint1CapturingTime, capturePoint2CapturingTime, capturePoint3CapturingTime, capturePoint4CapturingTime, capturePoint5CapturingTime
 } from "./includes/constants";
import { SetupScoreboard, UpdateScoreboardForPlayer, UpdateScoreboardForPlayerOnCapturePoint, UpdateScoreboardForPlayerOnKill, UpdateScoreboardForPlayerOnRevive } from "./includes/scoreboard";
import { SetupCapturePointUI, SetupTimeUI, UpdateCapturePointUI, UpdateTimeUI } from "./includes/ui";

let firstCapComplete = false;
let timerWasReset = false;

export async function OnGameModeStarted(): Promise<void> {
	mod.EnableCapturePointDeploying(capturePoint1, false);
	mod.EnableCapturePointDeploying(capturePoint2, false);
	mod.EnableCapturePointDeploying(capturePoint3, false);
	mod.EnableCapturePointDeploying(capturePoint4, false);
	mod.EnableCapturePointDeploying(capturePoint5, false);

	mod.SetCapturePointCapturingTime(capturePoint3, 24); // This is only for the first capture

	mod.EnableGameModeObjective(capturePoint1, false);
	mod.EnableGameModeObjective(capturePoint2, false);
	mod.EnableGameModeObjective(capturePoint3, true);
	mod.EnableGameModeObjective(capturePoint4, false);
	mod.EnableGameModeObjective(capturePoint5, false);

	SetupScoreboard();
	SetupTimeUI();
	SetupCapturePointUI();
	UpdateCapturePointUI(1, teamBlu);
	UpdateCapturePointUI(2, teamBlu);
	UpdateCapturePointUI(3, mod.GetTeam(0)); // Neutral
	UpdateCapturePointUI(4, teamRed);
	UpdateCapturePointUI(5, teamRed);

	// We do all logic related to the round timer here instead of in OngoingGlobal to avoid an issue where all logic stops being executed after ~5 minutes and 15 seconds
	while (true) {
		if (timerWasReset) {
			await mod.Wait(1);
			timerWasReset = false;
			continue;
		}

		let timeRemaining = mod.GetMatchTimeRemaining();

		if (timeRemaining <= 0) {
			mod.EndGameMode(mod.GetTeam(0)); // Stalemate
		}
		else if (mod.RoundToInteger(timeRemaining) == 180) {
			mod.PlayVO(VOGlobal, mod.VoiceOverEvents2D.TimeLow, mod.VoiceOverFlags.Alpha);
		}
		else if (mod.RoundToInteger(timeRemaining) == 60) {
			mod.PlayVO(VOGlobal, mod.VoiceOverEvents2D.Time60Left, mod.VoiceOverFlags.Alpha);
		}
		else if (mod.RoundToInteger(timeRemaining) == 30) {
			mod.PlayVO(VOGlobal, mod.VoiceOverEvents2D.Time30Left, mod.VoiceOverFlags.Alpha);
		}

		UpdateTimeUI(timeRemaining);
		await mod.Wait(1);
	}
}

export async function OnCapturePointCaptured(eventCapturePoint: mod.CapturePoint): Promise<void> {
	ResetTime();

	let capturingTeam = mod.GetCurrentOwnerTeam(eventCapturePoint);

	let playersOnPointOnCapturingTeam = modlib.FilteredArray(mod.GetPlayersOnPoint(eventCapturePoint), (player) => {
		return mod.Equals(capturingTeam, mod.GetTeam(player));
	});
	for (let i = 0; i < mod.CountOf(playersOnPointOnCapturingTeam); i++) {
		UpdateScoreboardForPlayerOnCapturePoint(mod.ValueInArray(playersOnPointOnCapturingTeam, i));
	}
	mod.PlaySound(104, 1, capturingTeam); // SFX_UI_Gamemode_Shared_CaptureObjectives_OnCapturedByFriendly_OneShot2D

	if (!firstCapComplete) {
		firstCapComplete = true;
		UpdateCapturePointUI(3, capturingTeam);
		if (mod.Equals(capturingTeam, teamRed)) {
			mod.EnableGameModeObjective(capturePoint2, true);
			mod.SetCapturePointNeutralizationTime(capturePoint2, capturePoint2NeutralizationTime);

			mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Charlie, teamRed);
			mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Charlie, teamBlu);
			await mod.Wait(1);
			mod.PlayVO(VOGlobal, mod.VoiceOverEvents2D.ObjectiveLocated, mod.VoiceOverFlags.Bravo);
		}
		else if (mod.Equals(capturingTeam, teamBlu)) {
			mod.EnableGameModeObjective(capturePoint4, true);
			mod.SetCapturePointNeutralizationTime(capturePoint4, capturePoint4NeutralizationTime);

			mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Charlie, teamBlu);
			mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Charlie, teamRed);
			await mod.Wait(1);
			mod.PlayVO(VOGlobal, mod.VoiceOverEvents2D.ObjectiveLocated, mod.VoiceOverFlags.Delta);
		}

		mod.SetCapturePointNeutralizationTime(capturePoint3, 16);

		// We need the if checks again because we need to set capturePoint3's times before playing the next VO
		await mod.Wait(20);
		if (mod.Equals(capturingTeam, teamRed)) {
			mod.PlayVO(VORed, mod.VoiceOverEvents2D.ProgressEarlyWinning, mod.VoiceOverFlags.Charlie, teamRed);
			mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ProgressEarlyLosing, mod.VoiceOverFlags.Charlie, teamBlu);
		}
		else if (mod.Equals(capturingTeam, teamBlu)) {
			mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ProgressEarlyWinning, mod.VoiceOverFlags.Charlie, teamBlu);
			mod.PlayVO(VORed, mod.VoiceOverEvents2D.ProgressEarlyLosing, mod.VoiceOverFlags.Charlie, teamRed);
		}
	}

	if (firstCapComplete) {
		if (mod.Equals(eventCapturePoint, capturePoint1)) {
			UpdateCapturePointUI(1, capturingTeam);
			if (mod.Equals(capturingTeam, teamRed)) {
				mod.EndGameMode(teamRed);
			}
			else if (mod.Equals(capturingTeam, teamBlu)) {
				mod.EnableGameModeObjective(capturePoint2, true);
				mod.SetCapturePointNeutralizationTime(capturePoint2, capturePoint2NeutralizationTime);

				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Alpha, teamBlu);
				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Alpha, teamRed);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint2)) {
			UpdateCapturePointUI(2, capturingTeam);
			if (mod.Equals(capturingTeam, teamRed)) {
				mod.EnableGameModeObjective(capturePoint3, false);
				mod.EnableGameModeObjective(capturePoint1, true);
				mod.SetCapturePointNeutralizationTime(capturePoint1, capturePoint1NeutralizationTime);

				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Bravo, teamRed);
				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Bravo, teamBlu);
				await mod.Wait(7);
				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ProgressLateWinning, mod.VoiceOverFlags.Bravo, teamRed);
				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ProgressLateLosing, mod.VoiceOverFlags.Bravo, teamBlu);
			}
			else if (mod.Equals(capturingTeam, teamBlu)) {
				mod.EnableGameModeObjective(capturePoint1, false);
				mod.EnableGameModeObjective(capturePoint3, true);
				mod.SetCapturePointNeutralizationTime(capturePoint3, capturePoint3NeutralizationTime);

				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Bravo, teamBlu);
				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Bravo, teamRed);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint3)) {
			UpdateCapturePointUI(3, capturingTeam);
			if (mod.Equals(capturingTeam, teamRed)) {
				mod.EnableGameModeObjective(capturePoint4, false);
				mod.EnableGameModeObjective(capturePoint2, true);
				mod.SetCapturePointNeutralizationTime(capturePoint2, capturePoint2NeutralizationTime);

				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Charlie, teamRed);
				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Charlie, teamBlu);
			}
			else if (mod.Equals(capturingTeam, teamBlu)) {
				mod.EnableGameModeObjective(capturePoint2, false);
				mod.EnableGameModeObjective(capturePoint4, true);
				mod.SetCapturePointNeutralizationTime(capturePoint4, capturePoint4NeutralizationTime);

				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Charlie, teamBlu);
				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Charlie, teamRed);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint4)) {
			UpdateCapturePointUI(4, capturingTeam);
			if (mod.Equals(capturingTeam, teamRed)) {
				mod.EnableGameModeObjective(capturePoint5, false);
				mod.EnableGameModeObjective(capturePoint3, true);
				mod.SetCapturePointNeutralizationTime(capturePoint3, capturePoint3NeutralizationTime);

				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Delta, teamRed);
				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Delta, teamBlu);
			}
			else if (mod.Equals(capturingTeam, teamBlu)) {
				mod.EnableGameModeObjective(capturePoint3, false);
				mod.EnableGameModeObjective(capturePoint5, true);
				mod.SetCapturePointNeutralizationTime(capturePoint5, capturePoint5NeutralizationTime);

				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Delta, teamBlu);
				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Delta, teamRed);
				await mod.Wait(7);
				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ProgressLateWinning, mod.VoiceOverFlags.Delta, teamBlu);
				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ProgressLateLosing, mod.VoiceOverFlags.Delta, teamRed);
			}
		}
		else if (mod.Equals(eventCapturePoint, capturePoint5)) {
			UpdateCapturePointUI(5, capturingTeam);
			if (mod.Equals(capturingTeam, teamRed)) {
				mod.EnableGameModeObjective(capturePoint4, true);
				mod.SetCapturePointNeutralizationTime(capturePoint4, capturePoint4NeutralizationTime);

				mod.PlayVO(VORed, mod.VoiceOverEvents2D.ObjectiveCaptured, mod.VoiceOverFlags.Echo, teamRed);
				mod.PlayVO(VOBlu, mod.VoiceOverEvents2D.ObjectiveCapturedEnemy, mod.VoiceOverFlags.Echo, teamBlu);
			}
			else if (mod.Equals(capturingTeam, teamBlu)) {
				mod.EndGameMode(teamBlu);
			}
		}
	}
}

export async function OnCapturePointLost(eventCapturePoint: mod.CapturePoint): Promise<void> {
	if (mod.Equals(eventCapturePoint, capturePoint1)) {
		mod.SetCapturePointCapturingTime(capturePoint1, capturePoint1CapturingTime);
	}
	else if (mod.Equals(eventCapturePoint, capturePoint2)) {
		mod.SetCapturePointCapturingTime(capturePoint2, capturePoint2CapturingTime);
	}
	else if (mod.Equals(eventCapturePoint, capturePoint3)) {
		mod.SetCapturePointCapturingTime(capturePoint3, capturePoint3CapturingTime);
	}
	else if (mod.Equals(eventCapturePoint, capturePoint4)) {
		mod.SetCapturePointCapturingTime(capturePoint4, capturePoint4CapturingTime);
	}
	else if (mod.Equals(eventCapturePoint, capturePoint5)) {
		mod.SetCapturePointCapturingTime(capturePoint5, capturePoint5CapturingTime);
	}
}

export async function OnPlayerEarnedKill(
	eventPlayer: mod.Player, // Player who earned the kill
	eventOtherPlayer: mod.Player, // Player who was killed
	eventDeathType: mod.DeathType,
	eventWeaponUnlock: mod.WeaponUnlock
): Promise<void> {
	UpdateScoreboardForPlayerOnKill(eventPlayer, eventOtherPlayer);
}

export async function OnRevived(
	eventPlayer: mod.Player, // Player who was revived
	eventOtherPlayer: mod.Player // Player who did the reviving
): Promise<void> {
	UpdateScoreboardForPlayerOnRevive(eventOtherPlayer);
}

export async function OnPlayerEnterCapturePoint(eventPlayer: mod.Player, eventCapturePoint: mod.CapturePoint): Promise<void> {
	mod.PlaySound(101, 1, eventPlayer); // SFX_UI_Gamemode_Shared_CaptureObjectives_ObjectiveOnEnter_OneShot2D
}

export async function OnPlayerExitCapturePoint(eventPlayer: mod.Player, eventCapturePoint: mod.CapturePoint): Promise<void> {
	mod.PlaySound(102, 1, eventPlayer); // SFX_UI_Gamemode_Shared_CaptureObjectives_ObjectiveOnExit_OneShot2D
}

export async function OnGameModeEnding(): Promise<void> {
	// If we don't delete the UI widgets, they persist during the post-game flow
	mod.DeleteAllUIWidgets();
}

async function ResetTime(): Promise<void> {
	timerWasReset = true;
	mod.ResetGameModeTime();
	UpdateTimeUI(600);
	await mod.Wait(1);
	mod.PauseGameModeTime(false);
}