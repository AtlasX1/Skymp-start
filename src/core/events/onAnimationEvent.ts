import { AnimationEventReturn, MP } from '../types';
import { genClientFunction, utils } from '../utility';
import { CTX } from '../platform';
import { currentActor, TRACE_ANIMATION } from '../constants';

declare const mp: MP;
declare const ctx: CTX;

export const initAnimationEvent = () => {
	mp.makeEventSource(
		'_onAnimationEvent',
		genClientFunction(() => {
			const next = ctx.sp.storage._api_onAnimationEvent;
			ctx.sp.storage._api_onAnimationEvent = {
				callback(...args: any) {
					const [serversideFormId, animEventName] = args;
					ctx.sendEvent(serversideFormId, {
						curr: animEventName,
						prev: ctx.state.prevAnimation,
					});
					ctx.state.prevAnimation = animEventName;
					if (typeof next.callback === 'function') {
						next.callback(...args);
					}
				},
			};
		}, '_onAnimationEvent')
	);

	/**
	 * on trigger animation event print animation name
	 */
	utils.hook('_onAnimationEvent', (pcFormId: number, serversideFormId: number, animEventName: AnimationEventReturn) => {
		if (serversideFormId !== currentActor) return;

		if (TRACE_ANIMATION) {
			utils.log('[ANIMATION TRACE]', animEventName);
		}
	});
};
