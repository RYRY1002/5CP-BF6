import * as modlib from "modlib";
import { capturePoint1, capturePoint2, capturePoint3, capturePoint4, capturePoint5, capturesPlayerVar, defensesPlayerVar, revivesPlayerVar } from "./constants";

export function SetupScoreboard(): void {
  mod.SetScoreboardHeader(mod.Message(mod.stringkeys.scoreboard.blu), mod.Message(mod.stringkeys.scoreboard.red));
  mod.SetScoreboardColumnNames(
    mod.Message(mod.stringkeys.scoreboard.captures),
    mod.Message(mod.stringkeys.scoreboard.defenses),
    mod.Message(mod.stringkeys.scoreboard.kills),
    mod.Message(mod.stringkeys.scoreboard.revives)
  );

  // There is a bug where players' scoreboard values persist between rounds, so we need to reset them here until this is fixed by BF Studios.
  let allPlayers = mod.AllPlayers();
  for (let i = 0; i < mod.CountOf(allPlayers); i++) {
    mod.SetScoreboardPlayerValues(
      mod.ValueInArray(allPlayers, i),
      0, 0, 0, 0
    );
  }
}

export function UpdateScoreboardForPlayerOnCapturePoint(playerOnCapturePoint: mod.Player): void {
  mod.SetVariable(mod.ObjectVariable(playerOnCapturePoint, capturesPlayerVar), mod.GetVariable(mod.ObjectVariable(playerOnCapturePoint, capturesPlayerVar)) + 1);
  UpdateScoreboardForPlayer(playerOnCapturePoint);
}

export function UpdateScoreboardForPlayerOnRevive(revivingPlayer: mod.Player): void {
  mod.SetVariable(mod.ObjectVariable(revivingPlayer, revivesPlayerVar), mod.GetVariable(mod.ObjectVariable(revivingPlayer, revivesPlayerVar)) + 1);
  UpdateScoreboardForPlayer(revivingPlayer);
}

export function UpdateScoreboardForPlayerOnKill(killingPlayer: mod.Player, killedPlayer: mod.Player): void {
  if (mod.GetCurrentOwnerTeam(capturePoint5) === mod.GetTeam(killingPlayer)) {
    //let isKillerOnOwnedPoint = false;
    let isVictimOnUnownedPoint = false;
    for (let i = 0; i < mod.CountOf(mod.GetPlayersOnPoint(capturePoint5)); i++) {
      /*if (mod.Equals(mod.ValueInArray(mod.GetPlayersOnPoint(capturePoint5), i), eventPlayer)) {
        isKillerOnOwnedPoint = true;
      }*/
      if (mod.Equals(mod.ValueInArray(mod.GetPlayersOnPoint(capturePoint5), i), killedPlayer)) {
        isVictimOnUnownedPoint = true;
      }
    }
    if (isVictimOnUnownedPoint) {
      mod.SetVariable(mod.ObjectVariable(killingPlayer, defensesPlayerVar), mod.GetVariable(mod.ObjectVariable(killingPlayer, defensesPlayerVar)) + 1);
    }
  }

  UpdateScoreboardForPlayer(killingPlayer);
}

export function UpdateScoreboardForPlayer(player: mod.Player): void {
  mod.SetScoreboardPlayerValues(player,
    mod.GetVariable(mod.ObjectVariable(player, capturesPlayerVar)),
    mod.GetVariable(mod.ObjectVariable(player, defensesPlayerVar)),
    mod.GetPlayerKills(player),
    mod.GetVariable(mod.ObjectVariable(player, revivesPlayerVar))
  );
}