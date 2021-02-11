import { getFunctionText, utils } from '../utility';
import { consoleOutput, actorValues, getPos, getAngle, getWorldOrCellDesc } from '../properties';
import { AttrAll, MP, PropertyName } from '../types';
import { currentActor, defaultSpawnPoint } from '../constants';
import { SpawnPoint, SpawnPointKeys, spawnSystem } from './spawnSystem';
import { inventorySystem } from './inventorySystem';
import { CTX } from '../platform';
import { cocSystem } from './cocSystem';

declare const mp: MP;
declare const ctx: CTX;

/**
 * if not selected form choose current pcFormId
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 */
const chooseFormId = (pcFormId: number, selectedFormId?: number) => {
	return selectedFormId ? selectedFormId : pcFormId;
};

/**
 * print selected form or current charecter
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 */
const chooseTip = (pcFormId: number, selectedFormId?: number) => {
	return selectedFormId ? '(selected)' : '(your character)';
};

/**
 * raise reinit event
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 */
export const reinit = (pcFormId: number, selectedFormId?: number) => {
	const targetFormId = chooseFormId(pcFormId, selectedFormId);
	const tip = chooseTip(pcFormId, selectedFormId);

	mp.onReinit(targetFormId, { force: true });

	consoleOutput.print(targetFormId, `Reinit ${targetFormId.toString(16)} ${tip}`);
};

/**
 * set av parameter
 * Example mp setav speedmult 300
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 * @param avName
 * @param newValueStr
 */
const setav = (pcFormId: number, selectedFormId: number, avName: AttrAll, newValueStr: string) => {
	let newValue = parseFloat(newValueStr);
	newValue = isFinite(newValue) ? newValue : 1;

	const targetFormId = chooseFormId(pcFormId, selectedFormId);
	const tip = chooseTip(pcFormId, selectedFormId);
	actorValues.set(targetFormId, avName, 'base', newValue);
	consoleOutput.print(targetFormId, `Set ${avName} to ${newValue} ${tip}`);
};

/**
 * kill selected target
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 */
const kill = (pcFormId: number, selectedFormId: number) => {
	const targetFormId = chooseFormId(pcFormId, selectedFormId);
	const tip = chooseTip(pcFormId, selectedFormId);

	const prev = mp.get(targetFormId, 'isDead');
	mp.set(targetFormId, 'isDead', !prev);

	consoleOutput.print(
		targetFormId,
		'Play visual effects for killing/resurrection',
		`${targetFormId.toString(16)} ${tip}`
	);
};

/**
 * disable selected target
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 */
const disable = (pcFormId: number, selectedFormId: number) => {
	const targetFormId = chooseFormId(pcFormId, selectedFormId);
	const tip = chooseTip(pcFormId, selectedFormId);

	const prev = mp.get(targetFormId, 'isDisabled');
	mp.set(targetFormId, 'isDisabled', !prev);
};

/**
 * spawn selected target
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 */
const spawn = (pcFormId: number, selectedFormId: number) => {
	const targetFormId = chooseFormId(pcFormId, selectedFormId);
	const tip = chooseTip(pcFormId, selectedFormId);

	spawnSystem.spawn(targetFormId);

	consoleOutput.print(targetFormId, `Teleporting to the spawnpoint ${targetFormId.toString(16)} ${tip}`);
};

/**
 * set current position as spawn point
 * @param pcFormId pc form id
 * @param selectedFormId selected form id
 */
const spawnpoint = (pcFormId: number, selectedFormId: number) => {
	const targetFormId = chooseFormId(pcFormId, selectedFormId);
	const tip = chooseTip(pcFormId, selectedFormId);

	spawnSystem.updateSpawnPoint(targetFormId);

	consoleOutput.print(targetFormId, `Spawnpoint has been updated for ${targetFormId.toString(16)} ${tip}`);
};

export const initDevCommands = () => {
	utils.hook('_onConsoleCommand', (pcFormId: number, ...args: any[]) => {
		const selectedFormId = args[0] !== currentActor ? args[0] : pcFormId;
		const sub = args[1];
		const arg0 = args[2];
		const arg1 = args[3];
		const arg2 = args[4];
		switch (sub) {
			case 'reinit':
				reinit(pcFormId, selectedFormId);
				break;
			case 'setav':
				setav(pcFormId, selectedFormId, arg0, arg1);
				break;
			case 'kill':
				kill(pcFormId, selectedFormId);
				break;
			case 'spawn':
				spawn(pcFormId, selectedFormId);
				break;
			case 'spawnpoint':
				spawnpoint(pcFormId, selectedFormId);
				break;
			case 'coc':
				cocSystem.tp(pcFormId, arg0);
				break;
			case 'scale':
				const scale = mp.get(pcFormId, 'scale');
				utils.log(scale);
				mp.set(pcFormId, 'scale', scale === 1 ? 2 : 1);
				break;
			case 'msg':
				const pos = mp.get(pcFormId, 'pos');
				break;
			case 'additem':
				if (!arg0) return;
				inventorySystem.addItem(pcFormId, +arg0, arg1 ? +arg1 : 1, arg2 ? true : false);
				break;
			case 'disable':
				disable(pcFormId, selectedFormId);
				break;
			case 'point':
				cocSystem.setNewPoint(arg0, {
					pos: getPos(pcFormId),
					angle: getAngle(pcFormId),
					worldOrCellDesc: getWorldOrCellDesc(pcFormId),
				});
				break;

			default:
				break;
		}
	});

	utils.hook('onUiEvent', (pcFormId: number, msg: Record<string, any>) => {
		let msgData = msg.data;
		if (msgData.data !== undefined) {
			msgData = msg.data.data;
		}
		console.log(msgData);
		switch (msg.type) {
			case 'dev-additem':
				inventorySystem.addItem(pcFormId, +msgData.id, msgData.count ? +msgData.count : 1);
				break;

			case 'dev-coc-zone':
				cocSystem.tp(pcFormId, msgData.zone);
				break;
		}
	});
};
