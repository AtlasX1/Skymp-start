import { setInterval } from 'timers';
import { MP } from '../types';
import { EventName } from '../types/EventName';

declare const mp: MP;
declare const global: {
	knownEvents: any;
	intervals: any;
};

export interface UTILS {
	log: (...args: any) => void;
	isActor: (formId: number) => boolean;
	hook: (eventName: EventName, callback: (...args: any[]) => void) => void;
	interval: (intervalName: string, intervalTime: number, callback: (...args: any[]) => void) => void;
}

/**
 * UTILITIES
 */
export const utils: UTILS = {
	/**
	 * print text in server side
	 * @param args arguments
	 */
	log: (...args: any) => {
		console.log.call(console, '[GM]', ...args);
	},
	/**
	 * return true if object is Actor
	 * @param formId unique identifier
	 */
	isActor: (formId: number) => {
		return mp.get(formId, 'type') === 'MpActor';
	},
	/**
	 * executing a function on the server side
	 * when an event is triggered on the client side
	 * @param eventName name of event
	 * @param callback function
	 */
	hook: (eventName: EventName, callback: (...args: any[]) => void) => {
		if (!global.knownEvents.includes(eventName)) {
			global.knownEvents.push(eventName);
		}
		const prev = mp[eventName];
		mp[eventName] = (...args: any[]) => {
			try {
				var prevRes = prev ? prev(...args) : undefined;
				const callbackRes = callback(...args);
				return callbackRes !== undefined ? callbackRes : prevRes;
			} catch (e) {
				utils.log(`'${eventName}' threw an error: ${e}`);
				if (e['stack']) {
					utils.log(e['stack']);
				}
				return undefined;
			}
		};
	},

	/**
	 * create interval on your callback function
	 * @param intervalName name of interval
	 * @param callback function
	 * @param intervalTime interval time
	 */
	interval: (intervalName: string, intervalTime: number, callback: (...args: any[]) => void) => {
		if (global.intervals[intervalName]) return;

		global.intervals[intervalName] = setInterval(() => {
			try {
				const callbackRes = callback();
			} catch (e) {
				utils.log(`'${intervalName}' threw an error: ${e}`);
			}
		}, intervalTime);
	},
};

/**
 * return function text as text
 * @param func source function
 */
export const getFunctionText = (func: Function, functionName?: string): string => {
	let funcString = func
		.toString()
		.substring(0, func.toString().length - 1)
		.replace(new RegExp('^.+?{', 'm'), '')
		.trim();

	// add try catch
	const date = new Date(Date.now());
	const m = date.getMinutes();
	const s = date.getSeconds();
	const ms = date.getMilliseconds();
	funcString = `
	try {
		${funcString}
	} catch(err) {
		ctx.sp.printConsole('${m}:${s}:${ms} [ERROR getFunctionText] (${functionName})', err);
	}
	`;

	return funcString;
};

/**
 * generate function for client
 * @param func generated function
 * @param args params
 */
export const genClientFunction = (func: Function, functionName?: string, args?: any, log: boolean = false) => {
	let result = getFunctionText(func, functionName);

	if (log) {
		result = Array(10).fill('/').join('') + 'end params' + Array(10).fill('/').join('') + '\n' + result;
	}
	for (let name in args) {
		switch (typeof args[name]) {
			case 'number':
				result = `const ${name} = ${args[name]};\n` + result;
				break;
			case 'string':
				result = `const ${name} = '${args[name]}';\n` + result;
				break;
			case 'boolean':
				result = `const ${name} = ${args[name]};\n` + result;
				break;
			case 'object':
				if (Array.isArray(args[name])) {
					result = `const ${name} = [${args[name]}];\n` + result;
				}
				break;
			case 'function':
				result = `const ${name} = ${args[name].toString()};\n` + result;
				break;
		}
	}
	if (log) {
		result = Array(10).fill('/').join('') + 'params' + Array(10).fill('/').join('') + '\n' + result;
	}
	if (log) {
		utils.log('[DEBUG] Generated function\n', result);
	}
	return result;
};

export const initUtils = () => {
	utils.log('Gamemode init');
	if (global.intervals === undefined) {
		global.intervals = {};
	}
	if (!Array.isArray(global.knownEvents)) {
		global.knownEvents = [];
	}
	for (const eventName of global.knownEvents) {
		delete mp[eventName];
	}
};

/**
 * Check if point in polygon
 * @param x x coordinate of point
 * @param y y coordinate of point
 * @param xp all x coordinate of polygon
 * @param yp all y coordinate of polygon
 */
let cacheInPoly: { [key: string]: boolean } = {};
export const inPoly = (x: number, y: number, xp: number[], yp: number[]) => {
	const index = x.toString() + y.toString() + xp.join('') + yp.join('');
	if (cacheInPoly[index]) {
		return cacheInPoly[index];
	}
	let npol = xp.length;
	let j = npol - 1;
	let c = false;
	for (let i = 0; i < npol; i++) {
		if (
			((yp[i] <= y && y < yp[j]) || (yp[j] <= y && y < yp[i])) &&
			x > ((xp[j] - xp[i]) * (y - yp[i])) / (yp[j] - yp[i]) + xp[i]
		) {
			c = !c;
		}
		j = i;
	}
	cacheInPoly[index] = c;
	return c;
};

/**
 *	check if array is equal
 * @param arr1 first array
 * @param arr2 second array
 */
export const isArrayEqual = (arr1: any, arr2: any): boolean => {
	const type = Object.prototype.toString.call(arr1);

	if (type !== Object.prototype.toString.call(arr2)) return false;

	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	const valueLen = type === '[object Array]' ? arr1.length : Object.keys(arr1).length;
	const otherLen = type === '[object Array]' ? arr2.length : Object.keys(arr2).length;

	if (valueLen !== otherLen) return false;

	const compare = (item1: any, item2: any) => {
		const itemType = Object.prototype.toString.call(item1);
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isArrayEqual(item1, item2)) return false;
		} else {
			if (itemType !== Object.prototype.toString.call(item2)) return false;
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}
		}
	};
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(arr1[i], arr2[i]) === false) return false;
		}
	} else {
		for (var key in arr1) {
			if (arr1.hasOwnProperty(key)) {
				if (compare(arr1[key], arr2[key]) === false) return false;
			}
		}
	}

	return true;
};
