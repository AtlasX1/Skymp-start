import { genClientFunction } from '../utility';
import { consoleOutput } from '../properties';
import { CTX } from '../platform';

declare const ctx: CTX;

/**
 * Toggle block state of objects
 * @param formIds object ids to block activation
 * @param state state of block
 */
const toggleBlock = (formIds: number[], state: boolean = false) => {
	formIds.forEach((id) => {
		const form = ctx.sp.Game.getForm(id);
		const obj = ctx.sp.ObjectReference.from(form);
		if (obj) {
			obj.blockActivation(state);
		}
	});
};

export const blockSystem = {
	/**
	 * Block activation of objects
	 * @param pcFormId actor id
	 * @param formIds object ids to block activation
	 */
	block: (pcFormId: number, formIds: number[]) => {
		consoleOutput.evalClient(pcFormId, genClientFunction(toggleBlock, 'block objects', { formIds, state: true }));
	},

	/**
	 * UnBlock activation of objects
	 * @param pcFormId actor id
	 * @param formIds object ids to unblock activation
	 */
	unblock: (pcFormId: number, formIds: number[]) => {
		consoleOutput.evalClient(pcFormId, genClientFunction(toggleBlock, 'unblock objects', { formIds, state: false }));
	},
};
