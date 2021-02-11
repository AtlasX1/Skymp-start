import { FormType } from '../platform/FormType';
import { ObjectReference } from '../platform/ObjectReference';

export interface CellChangeEvent {
	hasError: boolean;
	err?: string;
	currentCell?: CellChangeItem;
	prevCell?: CellChangeItem;
}

export interface CellChangeItem {
	id: number;
	name: string;
	type: number;
	keywords?: number[];
}

export interface ActivateEvent {
	target: ObjectReference;
	caster: ObjectReference;
	isCrimeToActivate: boolean;
}

export interface ActivateEventReturn {
	target: number;
	targetBaseId?: number;
	targetKeywords?: number[];
	targetBaseName?: string;
	caster: number;
	isCrimeToActivate: boolean;
	isActorWeaponDraw: boolean;
}

export interface ActivateMessageEventReturn {
	msgId: number;
	answer: number;
}

export interface ClientInputEvent {
	name: string;
	code: number;
}

export interface ContainerChangedEventResult {
	oldContainer: number;
	newContainer: number;
	baseId: number;
	count: number;
	other: any;
}

export interface HitEventReturn {
	isPowerAttack: boolean;
	isSneakAttack: boolean;
	isBashAttack: boolean;
	isHitBlocked: boolean;
	target: number;
	targetBaseId?: number;
	targetKeywords?: number[];
	targetDead?: boolean;
	agressor: number;
	source: number;
}

export interface MagicEffectApplyEventReturn {
	target: number;
	targetBaseId: number;
	targetBaseName: string;
	caster: number;
	effect: number;
	other?: any;
}

export interface EffectStartEventReturn {
	target: number;
	targetBaseId: number;
	targetBaseName: string;
	caster: number;
	effect: number;
	activeEffectId: number;
	activeEffectName: string;
	activeEffectMagnitude: number;
}

interface KeywordData {
	id: number;
	name: string;
}

export interface EquipEventReturn {
	baseId: number;
	baseName: string;
	type: FormType;
	keywords?: KeywordData[];
	other?: any;
}

export interface AnimationEventReturn {
	curr: string;
	prev: string;
}

export type message = {
	message?: string;
	type: 'error' | 'message' | 'add' | 'delete';
	baseId?: number;
	count?: number;
};
