import { initUtils, utils } from './utility';

import { initConsoleOutput, initSpawnPoint, initIsDead, initActorValue } from './properties';

import {
	initAnimationEvent,
	initActorValueFlushRequiredEvent,
	initBashEvent,
	initConsoleCommandEvent,
	initHitEvent,
	initPowerAttacksEvent,
	initSprintStateChangeEvent,
	initCurrentCellChangeEvent,
	initEmptyAnimationEvent,
	initHitStatic,
	initInputEvent,
	initActivateEvent,
	initSlowerUpdate,
	initEquipEvent,
	initMagicEffectApplyEvent,
	initActivateMessageEvent,
	initEffectStartEvent,
} from './events';

import { initDevCommands, initSpawnSystem } from './systems';

import { MP } from './types';

declare const mp: MP;

export const initCore = () => {
	// init creates events, properties
	// "utility/utils",
	initUtils();
	// "events/onHit",
	initHitEvent();

	// "properties/isDead",
	initIsDead();

	// "events/onSprintStateChange",
	initSprintStateChangeEvent();

	// "events/onPowerAttack",
	initPowerAttacksEvent();

	// "events/onBash",
	initBashEvent();

	// "properties/consoleOutput",
	initConsoleOutput();

	// "properties/actorValues",
	initActorValue();

	// "events/onActorValueFlushRequired",
	initActorValueFlushRequiredEvent();

	// "properties/spawnSystem",
	initSpawnPoint();

	// "events/onConsoleCommand",
	initConsoleCommandEvent();

	// "systems/developerCommands"
	initDevCommands();

	// "events/onAnimationEvent"
	initAnimationEvent();

	initSpawnSystem();

	initCurrentCellChangeEvent();
	initEmptyAnimationEvent();
	initHitStatic();
	initInputEvent();
	initActivateEvent();
	initSlowerUpdate();
	initEquipEvent();
	initMagicEffectApplyEvent();
	initActivateMessageEvent();
	initEffectStartEvent();

	utils.hook('onInit', (pcFormId: number) => {
		mp.onReinit(pcFormId);
	});
};
