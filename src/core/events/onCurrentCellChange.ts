import { CTX } from '../platform';
import { MP, CellChangeEvent, CellChangeItem } from '../types';
import { genClientFunction, utils } from '../utility';

declare const mp: MP;
declare const ctx: CTX;

export const initCurrentCellChangeEvent = () => {
	mp.makeEventSource(
		'_onCurrentCellChange',
		genClientFunction(
			() => {
				ctx.sp.on('update', () => {
					try {
						if (ctx.sp.Game.getPlayer().getFormID() !== 0x14) return;

						let result: CellChangeEvent = { hasError: false };
						const currentCell = ctx.sp.Game.getPlayer().getParentCell();

						const currentLocation = ctx.sp.Game.getPlayer().getCurrentLocation();
						if (currentLocation) {
							let keywords = [];
							for (let i = 0; i < currentLocation.getNumKeywords(); i++) {
								keywords.push(currentLocation.getNthKeyword(i).getFormID());
							}

							const currentCellData: CellChangeItem = {
								id: currentCell.getFormID(),
								name: currentCell.getName(),
								type: currentCell.getType(),
								keywords,
							};

							if (ctx.state.currentCell?.id !== currentCellData.id) {
								if (ctx.state.currentCell?.id !== undefined) {
									result.prevCell = ctx.state.currentCell;
									result.currentCell = currentCellData;
									ctx.sendEvent(result);
								}
								ctx.state.currentCell = currentCellData;
							}
						}
					} catch (err) {
						ctx.sendEvent({
							hasError: true,
							err: err.toString(),
						});
					}
				});
			},
			'_onCurrentCellChange',
			{}
		)
	);
	utils.hook('_onCurrentCellChange', (pcFormId: number, event: CellChangeEvent) => {
		if (!event.hasError) {
			// utils.log('[CELL_CHANGE]', event);
		} else {
			utils.log('[CELL_CHANGE]', 'ERROR: ' + event.err);
		}
	});
};
