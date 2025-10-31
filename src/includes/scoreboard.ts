import * as modlib from "modlib";
import { capturesPlayerVar, killsPlayerVar, assistsPlayerVar, revivesPlayerVar, undeploysPlayerVar } from "./constants";

export function SetupScoreboard(): void {
  mod.SetScoreboardHeader(mod.Message(mod.stringkeys.scoreboard.blu), mod.Message(mod.stringkeys.scoreboard.red));
  mod.SetScoreboardColumnNames(
    mod.Message(mod.stringkeys.scoreboard.captures),
    mod.Message(mod.stringkeys.scoreboard.kills),
    mod.Message(mod.stringkeys.scoreboard.assists),
    mod.Message(mod.stringkeys.scoreboard.revives),
    mod.Message(mod.stringkeys.scoreboard.deaths)
  );
  mod.SetScoreboardSorting(1, false); // Sort by captures, descending

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
  capturesPlayerVar.set(playerOnCapturePoint, (capturesPlayerVar.get(playerOnCapturePoint) || 0) + 1);
  UpdateScoreboardForPlayer(playerOnCapturePoint);
}

export function UpdateScoreboardForPlayerOnKill(killingPlayer: mod.Player, killedPlayer: mod.Player): void {
  if (killingPlayer != killedPlayer) {
    killsPlayerVar.set(killingPlayer, (killsPlayerVar.get(killingPlayer) || 0) + 1);
    UpdateScoreboardForPlayer(killingPlayer);
  }
}

export function UpdateScoreboardForPlayerOnKillAssist(assistingPlayer: mod.Player): void {
  assistsPlayerVar.set(assistingPlayer, (assistsPlayerVar.get(assistingPlayer) || 0) + 1);
  UpdateScoreboardForPlayer(assistingPlayer);
}

export function UpdateScoreboardForPlayerOnRevive(revivingPlayer: mod.Player): void {
  revivesPlayerVar.set(revivingPlayer, (revivesPlayerVar.get(revivingPlayer) || 0) + 1);
  UpdateScoreboardForPlayer(revivingPlayer);
}

export function UpdateScoreboardForPlayerOnUndeploy(undeployingPlayer: mod.Player): void {
  undeploysPlayerVar.set(undeployingPlayer, (undeploysPlayerVar.get(undeployingPlayer) || 0) + 1);
  UpdateScoreboardForPlayer(undeployingPlayer);
}

export function UpdateScoreboardForPlayer(player: mod.Player): void {
  mod.SetScoreboardPlayerValues(player,
    capturesPlayerVar.get(player) || 0,
    killsPlayerVar.get(player) || 0,
    assistsPlayerVar.get(player) || 0,
    revivesPlayerVar.get(player) || 0,
    undeploysPlayerVar.get(player) || 0
  );
}