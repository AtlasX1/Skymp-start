import { CTX } from '../platform';
import { getFunctionText, utils } from '../utility';
import { EffectStartEventReturn, MP } from '../types';
import { ActiveEffectApplyRemoveEvent } from '../platform/Event';

declare const mp: MP;
declare const ctx: CTX;

export const initEffectStartEvent = () => {
	mp.makeEventSource(
		'_onEffectStart',
		getFunctionText(() => {
			ctx.sp.on('effectStart', (event: any) => {
				const e = event as ActiveEffectApplyRemoveEvent;

				if (e.caster.getFormID() !== 0x14) return;

				const target = ctx.getFormIdInServerFormat(e.target.getFormID());
				const targetBase = e.target.getBaseObject();
				const caster = ctx.getFormIdInServerFormat(e.caster.getFormID());

				const result: EffectStartEventReturn = {
					caster,
					target,
					targetBaseId: targetBase?.getFormID(),
					targetBaseName: targetBase?.getName(),
					effect: e.effect.getFormID(),
					activeEffectId: e.activeEffect?.getBaseObject()?.getFormID(),
					activeEffectName: e.activeEffect?.getBaseObject()?.getName(),
					activeEffectMagnitude: e.activeEffect?.getMagnitude(),
				};
				ctx.sendEvent(result);
			});
		}, '_onEffectStart')
	);

	utils.hook('_onEffectStart', (pcFormId: number, event: EffectStartEventReturn) => {
		// utils.log('[onEffectStart]', event);
	});
};
