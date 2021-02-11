import { utils } from '../utility';
import { actorValues, getAngle, getPos, getWorldOrCellDesc } from '../properties';
import { defaultSpawnPoint } from '../constants';
import { PropertyName, MP } from '../types';
import { browserSystem } from './browserSystem';
import { cocSystem } from './cocSystem';

declare const mp: MP;

export interface SpawnPoint {
	pos: number[];
	angle: number[];
	worldOrCellDesc: string;
}
export type SpawnPointKeys = keyof SpawnPoint;

export const spawnSystem = {
	/**
	 * time to respawn
	 */
	timeToRespawn: 6000,

	/**
	 * return spawn point of actor
	 * @param targetFormId actor id
	 */
	getSpawnPoint: (targetFormId: number): SpawnPoint => {
		return mp.get(targetFormId, 'spawnPoint');
	},

	/**
	 * Spawn actor at default spawnPoint
	 * @param targetFormId actor id to spawn
	 */
	spawn: (targetFormId: number) => {
		const spawnPoint = spawnSystem.getSpawnPoint(targetFormId);
		for (const propName of Object.keys(spawnPoint || defaultSpawnPoint)) {
			mp.set(targetFormId, propName as PropertyName, (spawnPoint || defaultSpawnPoint)[propName as SpawnPointKeys]);
		}
		actorValues.set(targetFormId, 'health', 'damage', 0);
		actorValues.set(targetFormId, 'magicka', 'damage', 0);
		actorValues.set(targetFormId, 'stamina', 'damage', 0);
		setTimeout(() => {
			mp.set(targetFormId, 'isDead', false);
		}, 500);
		utils.log(`${targetFormId.toString(16)} respawns`);
	},

	/**
	 * Update default spawn point after death
	 * @param targetFormId object id
	 */
	updateSpawnPoint: (targetFormId: number, spawnPoint?: SpawnPoint) => {
		if (spawnPoint == undefined) {
			spawnPoint = {
				pos: getPos(targetFormId),
				angle: getAngle(targetFormId),
				worldOrCellDesc: getWorldOrCellDesc(targetFormId),
			};
		}
		mp.set(targetFormId, 'spawnPoint', spawnPoint);
	},
};

export const initSpawnSystem = () => {
	utils.hook('onUiEvent', (pcFormId: number, msg: Record<string, unknown>) => {
		switch (msg.type) {
			case 'socketOpen':
				const point = mp.get(pcFormId, 'startupSpawnPoint');
				if (point === undefined) {
					mp.sendUiMessage(pcFormId, {
						type: 'UPDATE_HIVESPAWN_SHOW',
						data: { show: true },
					});
					// browserSystem.setFocused(pcFormId, true);
				}
				break;
		}
	});

	utils.hook('onUiEvent', (pcFormId: number, msg: Record<string, any>) => {
		switch (msg.type) {
			case 'updateSpawn':
				mp.set(pcFormId, 'startupSpawnPoint', msg.data.code);
				cocSystem.tp(pcFormId, msg.data.code);
				break;
		}
	});
};
