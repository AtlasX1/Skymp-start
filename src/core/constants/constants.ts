import { SpawnPoint } from '../systems';

/**
 * current Actor
 */
export const currentActor = 0x14;

/**
 * global id
 */
export const globalId = 0xff000000;

/**
 * Default spawn point
 */
export const defaultSpawnPoint: SpawnPoint = {
	pos: [227, 239, 53],
	angle: [0, 0, 0],
	worldOrCellDesc: '165a7:Skyrim.esm',
};

/**
 * if true print all animation in console
 */
export const TRACE_ANIMATION: boolean = false;
export const PRODUCTION: boolean = false;
