import { genClientFunction, utils } from '../utility';
import { consoleOutput } from '../properties/consoleOutput';
import { CTX } from '../platform';

declare const ctx: CTX;

const activeLanguage = 'ru';

export type LangCodesKey =
	| 'delete item'
	| 'delete item 2'
	| 'add item'
	| 'add item 2'
	| 'eqiup item'
	| 'in farm zone'
	| 'out farm zone'
	| 'no empty buckets'
	| 'youre fired'
	| 'you cant quit your job'
	| 'not miner'
	| 'no profession'
	| 'green zone 1'
	| 'green zone 2'
	| 'green zone 3'
	| 'not in farm zone'
	| 'not weapon draw';

export type LangsKey = 'ru' | 'en';

export type LangCode = {
	[name in LangCodesKey]: string;
};

export type Langs = {
	[name in LangsKey]: LangCode;
};

const LANG_TABLE: Langs = {
	ru: {
		'delete item': 'Предмет удален: %NAME% - %COUNT%.',
		'delete item 2': 'Предмет удален: %NAME%.',
		'add item': 'Добавлен новый предмет: %NAME% - %COUNT%.',
		'add item 2': 'Добавлен новый предмет: %NAME%.',
		'eqiup item': '%NAME% - экипировано',
		'in farm zone': 'Вы вошли в зону посадки',
		'out farm zone': 'Вы покинули зону посадки',
		'not in farm zone': 'Вы не в зоне посадки',
		'no empty buckets': 'У тебя больше нет пустых ведер!',
		'youre fired': 'Ты уволен! Экипировка возвращена.',
		'you cant quit your job': 'Ошибка: игрок не может уволиться, не все предметы могут быть возвращены!',
		'not miner': 'Вы не шахтер!',
		'no profession': 'У вас нет профессии',
		'green zone 1': 'Вы с удивлением замечаете, что оставили лишь царапину',
		'green zone 2': 'Вы не верите своим глазам. Боги отвели удар от цели',
		'green zone 3': 'Вы чувствуете, что Кинарет наблюдает за вашими действиями',
		'not weapon draw': 'Уберите оружие из рук',
	},

	en: {
		'delete item': 'Item deleted: %NAME% - %COUNT%.',
		'delete item 2': 'Item deleted: %NAME%.',
		'add item': 'Item added: %NAME% - %COUNT%.',
		'add item 2': 'Item added: %NAME%.',
		'eqiup item': '%NAME% - equipped',
		'in farm zone': 'You have entered the planting area',
		'out farm zone': 'You have left the planting area',
		'not in farm zone': "You're not in the boarding area",
		'no empty buckets': 'You don`t have any more empty buckets!',
		'youre fired': 'You`re fired! Equipment returned.',
		'you cant quit your job': 'Error: The player can`t quit, not all items can be returned!',
		'not miner': 'You are not a miner!',
		'no profession': 'You don`t have a profession',
		'green zone 1': 'You are surprised to notice that you left only a scratch',
		'green zone 2': 'You can`t believe your eyes. The gods diverted the blow from the target',
		'green zone 3': 'You feel that the Kinaret is watching your actions',
		'not weapon draw': 'Take your weapons out of your hands',
	},
};

const lang = {
	get: (code: LangCodesKey) => {
		code = code.toLowerCase() as LangCodesKey;

		if (!LANG_TABLE[activeLanguage]) {
			utils.log('[LANG]', `lang: '${activeLanguage}'. language table not found.'`);
			return `ERROR: lang: '${activeLanguage}'`;
		}

		if (!LANG_TABLE[activeLanguage][code]) {
			utils.log('[LANG]', `lang: '${activeLanguage}', code: '${code}', string not found`);
			return `ERROR: lang: '${activeLanguage}', code: '${code}'`;
		}

		return LANG_TABLE[activeLanguage][code];
	},
};

interface NotificationArgs {
	msg?: string;
	baseId?: number;
	count?: number;
}

export const notificationSystem = {
	/**
	 * Generate and print notification based on arguments and code
	 * @param formId actor id
	 * @param code key code of language
	 * @param args arguments to generate notification
	 */
	print: (formId: number, code: LangCodesKey, args: NotificationArgs = {}): void => {
		args.msg = lang.get(code);

		consoleOutput.evalClient(
			formId,
			genClientFunction(
				(msg: string, baseId: number, count: number) => {
					let text = msg;

					if (typeof baseId !== 'undefined') {
						// ctx.sp.printConsole(baseId);
						const form = ctx.sp.Game.getFormEx(baseId);
						const base = ctx.sp.ObjectReference.from(form)?.getBaseObject();
						text = text.replace('%NAME%', base ? base.getName() : form.getName());
					}

					text = typeof count !== 'undefined' ? text.replace('%COUNT%', count.toString()) : text;

					ctx.sp.Debug.notification(text);
				},
				'CLIENT_NOTIFICATION',
				args
			)
		);
	},
};
