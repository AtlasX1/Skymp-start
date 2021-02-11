import { CTX } from '../platform';
import { getFunctionText, utils } from '../utility';
import { MagicEffectApplyEventReturn, MP } from '../types';
import { MagicEffectApplyEvent } from '../platform/Event';

declare const mp: MP;
declare const ctx: CTX;

export const initMagicEffectApplyEvent = () => {
	mp.makeEventSource(
		'_onMagicEffectApply',
		getFunctionText(() => {
			ctx.sp.on('magicEffectApply', (event: any) => {
				const e = event as MagicEffectApplyEvent;
				if (e.caster.getFormID() !== 0x14) return;

				const target = ctx.getFormIdInServerFormat(e.target.getFormID());
				const targetBase = e.target.getBaseObject();
				const caster = ctx.getFormIdInServerFormat(e.caster.getFormID());
				// const actor = ctx.sp.Game.getPlayer();
				// let keywords = [];
				// for (let i = 0; i < targetBase.getNumKeywords(); i++) {
				// 	keywords.push(targetBase.getNthKeyword(i).getFormID());
				// }
				// const effectForm = ctx.sp.Game.getForm(e.effect.getFormID());

				const result: MagicEffectApplyEventReturn = {
					caster,
					target,
					targetBaseId: targetBase.getFormID(),
					targetBaseName: targetBase.getName(),
					effect: e.effect.getFormID(),
				};
				ctx.sendEvent(result);
			});
		}, '_onMagicEffectApply')
	);

	utils.hook('_onMagicEffectApply', (pcFormId: number, event: MagicEffectApplyEventReturn) => {
		// utils.log('[MagicEffectApply]', event);
	});
};
