import { CTX } from '../platform';
import { genClientFunction, utils } from '../utility';
import { HitEventReturn, MP } from '../types';
import { HitEvent } from '../platform/Event';
import { currentActor } from '../constants';

declare const mp: MP;
declare const ctx: CTX;

export const initHitStatic = () => {
	/**
	 * event hit trigger only when the target isn't Actor
	 */
	mp.makeEventSource(
		'_onHitStatic',
		genClientFunction(
			() => {
				ctx.sp.on('hit', (event: any) => {
					const e = event as HitEvent;
					if (ctx.sp.Actor.from(e.target)) return;

					const agressor = ctx.getFormIdInServerFormat(e.agressor.getFormID());
					if (agressor !== 0x14) return;

					const target = ctx.getFormIdInServerFormat(e.target.getFormID());
					const targetBase = e.target.getBaseObject();

					let keywords = [];
					for (let i = 0; i < targetBase.getNumKeywords(); i++) {
						keywords.push(targetBase.getNthKeyword(i).getFormID());
					}

					const result: HitEventReturn = {
						isPowerAttack: e.isPowerAttack,
						isSneakAttack: e.isSneakAttack,
						isBashAttack: e.isBashAttack,
						isHitBlocked: e.isHitBlocked,
						target,
						targetBaseId: targetBase.getFormID(),
						targetKeywords: keywords,
						agressor,
						source: e.source ? e.source.getFormID() : 0,
					};
					ctx.sendEvent(result);
				});
			},
			'_onHitStatic',
			{}
		)
	);

	utils.hook('_onHitStatic', (pcFormId: number, eventData: HitEventReturn) => {
		if (eventData.target === currentActor) {
			eventData.target = pcFormId;
		}
		if (eventData.agressor === currentActor) {
			eventData.agressor = pcFormId;
		}
	});

	utils.hook('_onHitStatic', (pcFormId: number, eventData: HitEventReturn) => {
		// utils.log('[HIT STATIC]', eventData, pcFormId);
	});
};
