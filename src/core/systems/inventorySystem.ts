import { getEquipment, getInventar, consoleOutput } from '../properties';
import { CTX } from '../platform';
import { Equipment, Inventar, InventarItem, MP } from '../types';
import { genClientFunction } from '../utility';
import { notificationSystem } from './notificationSystem';

declare const mp: MP;
declare const ctx: CTX;

interface InventoryEvent {
	success: boolean;
	message: string;
}

export const inventorySystem = {
	/**
	 * Return inventar of Actor
	 * @param {number} formId Actor Id
	 */
	get: (formId: number) => {
		return getInventar(formId);
	},

	/**
	 * Return all equipment worn by the Actor
	 * @param {number} formId Actor Id
	 */
	getAllEquipedItems: (formId: number): Equipment => {
		const equipment: Equipment = getEquipment(formId);
		equipment.inv.entries = equipment.inv.entries.filter((item) => item.worn);
		return equipment;
	},

	/**
	 * Add item to player
	 * @param {number} formId who should I give the item to
	 * @param {number} baseId id of item
	 * @param {number} count quantity items
	 * @param {boolean} isSilent If true, no message will be printed to the screen
	 * @param {number} delay delay before add item in ms
	 */
	addItem: (formId: number, baseId: number, count: number = 1, isSilent: boolean = false, delay: number = 0): void => {
		if (!baseId) return;
		if (count <= 0) return;

		const inv = getInventar(formId);
		let added = false;
		for (const value of inv.entries) {
			if (Object.keys(value).length == 2 && value.baseId == baseId) {
				value.count += count;
				added = true;
				break;
			}
		}
		if (!added) {
			inv.entries.push({ baseId, count });
		}
		mp.set(formId, 'inventory', inv);

		if (!isSilent) {
			setTimeout(() => {
				notificationSystem.print(formId, 'add item', { baseId, count });
			}, delay);
		}
	},

	/**
	 * delete item from player inventar
	 * @param {number} formId who should I delete the item to
	 * @param {number} baseId id of item
	 * @param {number} count quantity items
	 * @param {boolean} isSilent If true, no message will be printed to the screen
	 */
	deleteItem: (formId: number, baseId: number, count: number, isSilent: boolean = false): InventoryEvent => {
		let result: InventoryEvent = {
			success: false,
			message: 'Error: deleteItem()!',
		};
		if (count <= 0) {
			result.message = 'Ошибка: Количество предметов для удаления должны быть больше 0!';
			return result;
		}
		const inv = getInventar(formId);

		const deletedItemIndex = inv.entries.findIndex((item) => item.baseId === baseId);

		if (deletedItemIndex === -1) {
			result.message = 'Ошибка: Предмет не найден!';
			return result;
		}

		const newCount = inv.entries[deletedItemIndex].count - count;

		if (newCount < 0) {
			result.message = 'Ошибка: Нехватает предметов чтобы их удалить!';
			return result;
		} else if (newCount === 0) {
			inv.entries = inv.entries.filter((item) => item.baseId !== baseId);
			mp.set(formId, 'inventory', inv);

			result.success = true;
			result.message = isSilent ? '' : 'Успех: Предмет удален из инвентаря.';
			return result;
		} else if (newCount > 0) {
			inv.entries = inv.entries;
			inv.entries[deletedItemIndex].count = newCount;
			mp.set(formId, 'inventory', inv);

			result.success = true;
			result.message = isSilent ? '' : `Успех: Количество предмета изменено на ${newCount}.`;
			if (result.message && !isSilent) {
				mp.set(formId, 'message', result.message);
			}
			return result;
		}
		return result;
	},

	/**
	 * Eqiup item to player
	 * @param formId who should I eqiup the item to
	 * @param baseId id of item
	 */
	eqiupItem: (formId: number, baseId: number, isSilent: boolean = false) => {
		consoleOutput.evalClient(
			formId,
			genClientFunction(
				() => {
					const form = ctx.sp.Game.getFormEx(baseId);
					ctx.sp.Game.getPlayer().equipItem(form, false, true);
				},
				'equip item',
				{ baseId }
			)
		);

		if (!isSilent) {
			consoleOutput.evalClient(
				formId,
				genClientFunction(
					() => {
						const name = ctx.sp.Game.getFormEx(baseId).getName();
						ctx.sp.Debug.notification(`${name} - экипировано`);
					},
					'notification equip item',
					{ baseId }
				)
			);
		}
	},

	/**
	 * Return true if the item is in the inventory
	 * @param formId who should I eqiup the item to
	 * @param baseId id of item
	 */
	isInInventory: (formId: number, baseId: number): boolean => {
		return getInventar(formId).entries.find((el) => el.baseId === baseId) ? true : false;
	},

	/**
	 * Return true if the item is equiped
	 * @param formId who should I eqiup the item to
	 * @param baseId id of item
	 */
	isEquip: (formId: number, baseId: number | undefined): boolean => {
		if (!baseId) return false;
		return getEquipment(formId).inv.entries.find((item) => item.baseId === baseId)?.worn ?? false;
	},

	/**
	 * find item and if exist return it
	 * @param inv actor inventar
	 * @param baseId item id to find
	 */
	find: (inv: Inventar, baseId: number): InventarItem | undefined => {
		return inv.entries.find((x) => x.baseId === baseId);
	},
};
