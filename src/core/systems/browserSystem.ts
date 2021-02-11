import { CTX } from '../platform';
import { consoleOutput } from '../properties';
import { genClientFunction } from '../utility';

declare const ctx: CTX;

export const browserSystem = {
	/**
	 * Change visible state of browser
	 * @param formId actor id
	 * @param visible visible state of browser
	 */
	setVisible: (formId: number, visible: boolean): void => {
		consoleOutput.evalClient(
			formId,
			genClientFunction(
				() => {
					ctx.sp.printConsole('changeVisible');
					ctx.sp.printConsole(visible);
					ctx.sp.browser.setVisible(visible);
				},
				'change browser visible',
				{ visible }
			)
		);
	},

	/**
	 * Change focused state of browser
	 * @param formId actor id
	 * @param focused focused state of browser
	 */
	setFocused: (formId: number, focused: boolean): void => {
		consoleOutput.evalClient(
			formId,
			genClientFunction(
				() => {
					ctx.sp.printConsole('changeFocused');
					ctx.sp.printConsole(focused);
					ctx.sp.browser.setFocused(focused);
				},
				'change browser focused',
				{ focused }
			)
		);
	},
};
