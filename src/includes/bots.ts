import { capturePoint3, teamBlu } from "./constants";

let botsSpawned = false;

export async function OnPlayerInteract(eventPlayer: mod.Player, eventInteractPoint: mod.InteractPoint): Promise<void> {
	if (!botsSpawned) {
		botsSpawned = true;
		mod.SpawnAIFromAISpawner(mod.GetSpawner(51), teamBlu);
		mod.Wait(3);
		mod.SpawnAIFromAISpawner(mod.GetSpawner(51), teamBlu);
		mod.Wait(3);
		mod.SpawnAIFromAISpawner(mod.GetSpawner(51), teamBlu);
		mod.Wait(3);
		mod.SpawnAIFromAISpawner(mod.GetSpawner(51), teamBlu);
		mod.Wait(3);
		mod.SpawnAIFromAISpawner(mod.GetSpawner(51), teamBlu);
	}

	else if (botsSpawned) {
		console.log("Directing all bots to capture point 3");
		let allPlayers = mod.AllPlayers();
		for (let i = 0; i < mod.CountOf(allPlayers); i++) {
			mod.AIMoveToBehavior(mod.ValueInArray(allPlayers, i), mod.GetObjectPosition(capturePoint3));
		}
	}
}