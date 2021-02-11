import { join } from 'path';
import { CTX } from '../platform';
import { EquipEvent } from '../platform/Event';
import { MP, EquipEventReturn } from '../types';
import { getFunctionText, utils } from '../utility';

declare const mp: MP;
declare const ctx: CTX;

export const initEquipEvent = () => {
	mp.makeEventSource(
		'_onEquip',
		getFunctionText(() => {
			ctx.sp.on('equip', (event: any) => {
				const e: EquipEvent = event as EquipEvent;

				let keywords = [];
				for (let i = 0; i < e.baseObj.getNumKeywords(); i++) {
					keywords.push({
						id: e.baseObj.getNthKeyword(i).getFormID(),
						name: e.baseObj.getNthKeyword(i).getName(),
					});
				}

				const result: EquipEventReturn = {
					baseId: e.baseObj.getFormID(),
					baseName: e.baseObj.getName(),
					type: e.baseObj.getType(),
					keywords,
				};
				ctx.sendEvent(result);
			});
		}, '_onEquip')
	);

	utils.hook('_onEquip', (pcFormId: number, event: EquipEventReturn) => {
		// utils.log('[EQUIP]', event);
	});
};
