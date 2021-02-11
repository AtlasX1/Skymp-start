import { Form } from './Form';
import { ObjectReference } from './ObjectReference';
import { Spell } from './Spell';
import {
	Perk,
	Shout,
	HeadPart,
	Faction,
	Package,
	Armor,
	Weapon,
	ActorBase,
	Race,
	AssociationType,
	Idle,
	TextureSet,
	Outfit,
	FormList,
} from './Classes';
import { Keyword } from './Keyword';
import { MagicEffect } from './MagicEffect';

export interface Actor extends ObjectReference {
	from: (form: Form) => Actor;
	addPerk: (akPerk: Perk) => void;
	addShout: (akShout: Shout) => boolean;
	addSpell: (akSpell: Spell, abVerbose: boolean) => boolean;
	allowBleedoutDialogue: (abCanTalk: boolean) => void;
	allowPCDialogue: (abTalk: boolean) => void;
	attachAshPile: (akAshPileBase: Form) => void;
	canFlyHere: () => boolean;
	changeHeadPart: (hPart: HeadPart) => void;
	clearArrested: () => void;
	clearExpressionOverride: () => void;
	clearExtraArrows: () => void;
	clearForcedMovement: () => void;
	clearKeepOffsetFromActor: () => void;
	clearLookAt: () => void;
	damageActorValue: (asValueName: string, afDamage: number) => void;
	dismount: () => boolean;
	dispelAllSpells: () => void;
	dispelSpell: (akSpell: Spell) => boolean;
	doCombatSpellApply: (akSpell: Spell, akTarget: ObjectReference) => void;
	drawWeapon: () => void;
	enableAI: (abEnable: boolean) => void;
	endDeferredKill: () => void;
	equipItem: (akItem: Form, abPreventRemoval: boolean, abSilent: boolean) => void;
	equipItemById: (item: Form, itemId: number, equipSlot: number, preventUnequip: boolean, equipSound: boolean) => void;
	equipItemEx: (item: Form, equipSlot: number, preventUnequip: boolean, equipSound: boolean) => void;
	equipShout: (akShout: Shout) => void;
	equipSpell: (akSpell: Spell, aiSource: number) => void;
	evaluatePackage: () => void;
	forceActorValue: (asValueName: string, afNewValue: number) => void;
	forceMovementDirection: (afXAngle: number, afYAngle: number, afZAngle: number) => void;
	forceMovementDirectionRamp: (afXAngle: number, afYAngle: number, afZAngle: number, afRampTime: number) => void;
	forceMovementRotationSpeed: (afXMult: number, afYMult: number, afZMult: number) => void;
	forceMovementRotationSpeedRamp: (afXMult: number, afYMult: number, afZMult: number, afRampTime: number) => void;
	forceMovementSpeed: (afSpeedMult: number) => void;
	forceMovementSpeedRamp: (afSpeedMult: number, afRampTime: number) => void;
	forceTargetAngle: (afXAngle: number, afYAngle: number, afZAngle: number) => void;
	forceTargetDirection: (afXAngle: number, afYAngle: number, afZAngle: number) => void;
	forceTargetSpeed: (afSpeed: number) => void;
	getActorValue: (asValueName: string) => number;
	getActorValueMax: (asValueName: string) => number;
	getActorValuePercentage: (asValueName: string) => number;
	getBaseActorValue: (asValueName: string) => number;
	getBribeAmount: () => number;
	getCombatState: () => number;
	getCombatTarget: () => Actor;
	getCrimeFaction: () => Faction;
	getCurrentPackage: () => Package;
	getDialogueTarget: () => Actor;
	getEquippedArmorInSlot: (aiSlot: number) => Armor;
	getEquippedItemId: (Location: number) => number;
	getEquippedItemType: (aiHand: number) => number;
	getEquippedObject: (Location: number) => Form;
	getEquippedShield: () => Armor;
	getEquippedShout: () => Shout;
	getEquippedSpell: (aiSource: number) => Spell;
	getEquippedWeapon: (abLeftHand: boolean) => Weapon;
	getFactionRank: (akFaction: Faction) => number;
	getFactionReaction: (akOther: Actor) => number;
	getFactions: (minRank: number, maxRank: number) => object[];
	getFlyingState: () => number;
	getForcedLandingMarker: () => ObjectReference;
	getFurnitureReference: () => ObjectReference;
	getGoldAmount: () => number;
	getHighestRelationshipRank: () => number;
	getKiller: () => Actor;
	getLevel: () => number;
	getLeveledActorBase: () => ActorBase;
	getLightLevel: () => number;
	getLowestRelationshipRank: () => number;
	getNoBleedoutRecovery: () => boolean;
	getNthSpell: (n: number) => Spell;
	getPlayerControls: () => boolean;
	getRace: () => Race;
	getRelationshipRank: (akOther: Actor) => number;
	getSitState: () => number;
	getSleepState: () => number;
	getSpellCount: () => number;
	getVoiceRecoveryTime: () => number;
	getWarmthRating: () => number;
	getWornForm: (slotMask: number) => Form;
	getWornItemId: (slotMask: number) => number;
	hasAssociation: (akAssociation: AssociationType, akOther: Actor) => boolean;
	hasFamilyRelationship: (akOther: Actor) => boolean;
	hasLOS: (akOther: ObjectReference) => boolean;
	hasMagicEffect: (akEffect: MagicEffect) => boolean;
	hasMagicEffectWithKeyword: (akKeyword: Keyword) => boolean;
	hasParentRelationship: (akOther: Actor) => boolean;
	hasPerk: (akPerk: Perk) => boolean;
	hasSpell: (akForm: Form) => boolean;
	isAIEnabled: () => boolean;
	isAlarmed: () => boolean;
	isAlerted: () => boolean;
	isAllowedToFly: () => boolean;
	isArrested: () => boolean;
	isArrestingTarget: () => boolean;
	isBeingRidden: () => boolean;
	isBleedingOut: () => boolean;
	isBribed: () => boolean;
	isChild: () => boolean;
	isCommandedActor: () => boolean;
	isDead: () => boolean;
	isDetectedBy: (akOther: Actor) => boolean;
	isDoingFavor: () => boolean;
	isEquipped: (akItem: Form) => boolean;
	isEssential: () => boolean;
	isFlying: () => boolean;
	isGhost: () => boolean;
	isGuard: () => boolean;
	isHostileToActor: (akActor: Actor) => boolean;
	isInCombat: () => boolean;
	isInFaction: (akFaction: Faction) => boolean;
	isInKillMove: () => boolean;
	isIntimidated: () => boolean;
	isOnMount: () => boolean;
	isOverEncumbered: () => boolean;
	isPlayerTeammate: () => boolean;
	isPlayersLastRiddenHorse: () => boolean;
	isRunning: () => boolean;
	isSneaking: () => boolean;
	isSprinting: () => boolean;
	isSwimming: () => boolean;
	isTrespassing: () => boolean;
	isUnconscious: () => boolean;
	isWeaponDrawn: () => boolean;
	keepOffsetFromActor: (
		arTarget: Actor,
		afOffsetX: number,
		afOffsetY: number,
		afOffsetZ: number,
		afOffsetAngleX: number,
		afOffsetAngleY: number,
		afOffsetAngleZ: number,
		afCatchUpRadius: number,
		afFollowRadius: number
	) => void;
	kill: (akKiller?: Actor | null) => void;
	killSilent: (akKiller: Actor) => void;
	modActorValue: (asValueName: string, afAmount: number) => void;
	modFactionRank: (akFaction: Faction, aiMod: number) => void;
	moveToPackageLocation: () => Promise<void>;
	openInventory: (abForceOpen: boolean) => void;
	pathToReference: (aTarget: ObjectReference, afWalkRunPercent: number) => Promise<boolean>;
	playIdle: (akIdle: Idle) => boolean;
	playIdleWithTarget: (akIdle: Idle, akTarget: ObjectReference) => boolean;
	playSubGraphAnimation: (asEventName: string) => void;
	queueNiNodeUpdate: () => void;
	regenerateHead: () => void;
	removeFromAllFactions: () => void;
	removeFromFaction: (akFaction: Faction) => void;
	removePerk: (akPerk: Perk) => void;
	removeShout: (akShout: Shout) => boolean;
	removeSpell: (akSpell: Spell) => boolean;
	replaceHeadPart: (oPart: HeadPart, newPart: HeadPart) => void;
	resetAI: () => void;
	resetExpressionOverrides: () => void;
	resetHealthAndLimbs: () => void;
	restoreActorValue: (asValueName: string, afAmount: number) => void;
	resurrect: () => Promise<void>;
	sendAssaultAlarm: () => void;
	sendLycanthropyStateChanged: (abIsWerewolf: boolean) => void;
	sendTrespassAlarm: (akCriminal: Actor) => void;
	sendVampirismStateChanged: (abIsVampire: boolean) => void;
	setActorValue: (asValueName: string, afValue: number) => void;
	setAlert: (abAlerted: boolean) => void;
	setAllowFlying: (abAllowed: boolean) => void;
	setAllowFlyingEx: (abAllowed: boolean, abAllowCrash: boolean, abAllowSearch: boolean) => void;
	setAlpha: (afTargetAlpha: number, abFade: boolean) => void;
	setAttackActorOnSight: (abAttackOnSight: boolean) => void;
	setBribed: (abBribe: boolean) => void;
	setCrimeFaction: (akFaction: Faction) => void;
	setCriticalStage: (aiStage: number) => void;
	setDoingFavor: (abDoingFavor: boolean) => void;
	setDontMove: (abDontMove: boolean) => void;
	setExpressionModifier: (index: number, value: number) => void;
	setExpressionOverride: (aiMood: number, aiStrength: number) => void;
	setExpressionPhoneme: (index: number, value: number) => void;
	setEyeTexture: (akNewTexture: TextureSet) => void;
	setFactionRank: (akFaction: Faction, aiRank: number) => void;
	setForcedLandingMarker: (aMarker: ObjectReference) => void;
	setGhost: (abIsGhost: boolean) => void;
	setHeadTracking: (abEnable: boolean) => void;
	setIntimidated: (abIntimidate: boolean) => void;
	setLookAt: (akTarget: ObjectReference, abPathingLookAt: boolean) => void;
	setNoBleedoutRecovery: (abAllowed: boolean) => void;
	setNotShowOnStealthMeter: (abNotShow: boolean) => void;
	setOutfit: (akOutfit: Outfit, abSleepOutfit: boolean) => void;
	setPlayerControls: (abControls: boolean) => void;
	setPlayerResistingArrest: () => void;
	setPlayerTeammate: (abTeammate: boolean, abCanDoFavor: boolean) => void;
	setRace: (akRace: Race) => void;
	setRelationshipRank: (akOther: Actor, aiRank: number) => void;
	setRestrained: (abRestrained: boolean) => void;
	setSubGraphFloatVariable: (asVariableName: string, afValue: number) => void;
	setUnconscious: (abUnconscious: boolean) => void;
	setVehicle: (akVehicle: ObjectReference) => void;
	setVoiceRecoveryTime: (afTime: number) => void;
	sheatheWeapon: () => void;
	showBarterMenu: () => void;
	showGiftMenu: (
		abGivingGift: boolean,
		apFilterList: FormList,
		abShowStolenItems: boolean,
		abUseFavorPoints: boolean
	) => Promise<number>;
	startCannibal: (akTarget: Actor) => void;
	startCombat: (akTarget: Actor) => void;
	startDeferredKill: () => void;
	startSneaking: () => void;
	startVampireFeed: (akTarget: Actor) => void;
	stopCombat: () => void;
	stopCombatAlarm: () => void;
	trapSoul: (akTarget: Actor) => boolean;
	unLockOwnedDoorsInCell: () => void;
	unequipAll: () => void;
	unequipItem: (akItem: Form, abPreventEquip: boolean, abSilent: boolean) => void;
	unequipItemEx: (item: Form, equipSlot: number, preventEquip: boolean) => void;
	unequipItemSlot: (aiSlot: number) => void;
	unequipShout: (akShout: Shout) => void;
	unequipSpell: (akSpell: Spell, aiSource: number) => void;
	updateWeight: (neckDelta: number) => void;
	willIntimidateSucceed: () => boolean;
	wornHasKeyword: (akKeyword: Keyword) => boolean;
}