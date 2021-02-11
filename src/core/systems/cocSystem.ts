import { MP, PropertyName } from '../types';
import { SpawnPoint, SpawnPointKeys } from './spawnSystem';
import fs from 'fs';
import util from 'util';
import { utils } from '../utility';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

declare const mp: MP;

export const cocSystem = {
	/**
	 * teleport actor to point by key
	 * information about places store in file coc.json
	 * @param formId pc form id
	 * @param key
	 */
	tp: async (formId: number, key: string) => {
		const data = JSON.parse((await readFile('coc.json')).toString());

		const targetPoint = data[key];

		if (targetPoint === undefined) {
			utils.log(`Файл coc.json не содержит данных про точку с ключом: ${key}`);
			// consoleOutput.print(formId, `Файл coc.json не содержит данных про точку с ключом: ${key}`);
			return;
		}

		for (const propName of Object.keys(targetPoint)) {
			mp.set(formId, propName as PropertyName, targetPoint[propName as SpawnPointKeys]);
		}
	},

	/**
	 * save current position if coc.json
	 * @param key key of new point
	 * @param newData data of nwe point
	 */
	setNewPoint: async (key: string, newData: SpawnPoint) => {
		try {
			const data = JSON.parse((await readFile('coc.json')).toString());
			data[key] = newData;
			await writeFile('coc.json', JSON.stringify(data));
		} catch (err) {
			utils.log(err);
		}
	},
};
