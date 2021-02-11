import { CTX } from '../platform';
import { getFunctionText, utils } from '../utility';
import { ActivateEvent, ActivateMessageEventReturn, MP } from '../types';
import { ObjectReference } from '../platform/ObjectReference';

declare const mp: MP;
declare const ctx: CTX;

export const initActivateMessageEvent = () => {
	mp.makeEventSource(
		'_onActivateMessage',
		getFunctionText(() => {
			const targetMessage = new Map<number, number>();

			ctx.sp.on('activate', (event: any) => {
				const e = event as ActivateEvent;
				if (e.caster.getFormID() !== 0x14) return;

				const target: ObjectReference = e.target;
				const targetServerId = ctx.getFormIdInServerFormat(target.getFormID());

				const msgId = targetMessage.get(targetServerId);

				if (!msgId) return;

				const form = ctx.sp.Game.getFormEx(msgId);
				const msg = ctx.sp.Message.from(form);
				msg.show(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0).then((answer) => {
					ctx.sendEvent({
						msgId,
						answer,
					});
				});
			});
		}, '_onActivateMessage')
	);

	utils.hook('_onActivateMessage', (pcFormId: number, event: ActivateMessageEventReturn) => {
		utils.log('[ACTIVATE MESSAGE]', event);
	});
};
