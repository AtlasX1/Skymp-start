/**
 * Built-in events
 */
type SystemEventName = 'onDeath' | 'onInit' | 'onReinit' | 'onUiEvent';

type SlowerUpdateEvents =
	| `_onUpdate1sec`
	| '_onUpdate2sec'
	| '_onUpdate5sec'
	| '_onUpdate60sec'
	| '_onUpdate180sec'
	| '_onUpdate600sec';

/**
 * Custom events
 */
type CustomEventName =
	| SlowerUpdateEvents
	| '_'
	| '_1'
	| '_onBash'
	| '_onConsoleCommand'
	| '_onCurrentCellChange'
	| '_onHit'
	| '_onLocalDeath'
	| '_onPowerAttack'
	| '_onActorValueFlushRequiredhealth'
	| '_onActorValueFlushRequiredstamina'
	| '_onActorValueFlushRequiredmagicka'
	| '_onSprintStateChange'
	| '_onHitScale'
	| '_onActivate'
	| '_onAnimationEvent'
	| '_onHitStatic'
	| '_onInput'
	| '_onCellFullyLoaded'
	| '_onMagicEffectApply'
	| '_onEquip'
	| '_onContainerChange'
	| '_onActivateMessage'
	| '_onEffectStart'
	| '_onBlockActivation';

export type EventName = SystemEventName | CustomEventName;
