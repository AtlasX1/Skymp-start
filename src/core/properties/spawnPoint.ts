import { defaultSpawnPoint } from '../constants';
import { CTX } from '../platform';
import { spawnSystem } from '../systems';
import { MP } from '../types';
import { genClientFunction, utils } from '../utility';
import { consoleOutput } from './consoleOutput';

declare const mp: MP;
declare const ctx: CTX;

export const initSpawnPoint = () => {
	mp.makeProperty('spawnPoint', {
		isVisibleByOwner: false,
		isVisibleByNeighbors: false,
		updateNeighbor: '',
		updateOwner: '',
	});

	mp.makeProperty('startupSpawnPoint', {
		isVisibleByOwner: false,
		isVisibleByNeighbors: false,
		updateNeighbor: '',
		updateOwner: '',
	});

	utils.hook('onDeath', (pcFormId: number) => {
		// don't spawn npc
		if (mp.get(pcFormId, 'baseDesc') === '7:Skyrim.esm') {
			setTimeout(() => {
				spawnSystem.spawn(pcFormId);
			}, spawnSystem.timeToRespawn);
		} else {
			setTimeout(() => {
				// mp.set(pcFormId, 'isDisabled', true);
				consoleOutput.evalClient(
					pcFormId,
					genClientFunction(
						() => {
							const form = ctx.sp.Game.getFormEx(pcFormId);
							const obj = ctx.sp.ObjectReference.from(form);
							// obj.setPosition(0, 0, -999_999_999);
							obj.delete();
						},
						'remove dead npc',
						{ pcFormId }
					)
				);
			}, 2_000);
		}
	});

	utils.hook('onReinit', (pcFormId: number, options: any) => {
		/** set respawn point */
		if (!mp.get(pcFormId, 'spawnPoint') || (options && options.force)) {
			mp.set(pcFormId, 'spawnPoint', defaultSpawnPoint);
		}
	});
};
