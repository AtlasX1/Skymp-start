import { CTX } from '../platform';
import { genClientFunction } from '../utility';
import { EventName, MP } from '../types';

declare const mp: MP;
declare const ctx: CTX;

const secondsToWait = [1, 2, 5, 60, 180, 600];

export const initSlowerUpdate = () => {
	secondsToWait.forEach((sec) => {
		mp.makeEventSource(
			`_onUpdate${sec}sec` as EventName,
			genClientFunction(
				(sec: number) => {
					ctx.sp.on('update', async () => {
						if (ctx.state.isWaiting) return;
						ctx.state.isWaiting = true;
						await ctx.sp.Utility.wait(sec);
						ctx.state.isWaiting = false;
						ctx.sendEvent();
					});
				},
				`update${sec}sec`,
				{ sec }
			)
		);
	});
};
