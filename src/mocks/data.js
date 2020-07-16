import casual from 'casual-browserify';
import {depositSystemsValues, depositTypesValues,statusesValues, withdrawalFeeTypesValues, withdrawalTypesValues} from '../values';

export const array_of = function(times, generator) {
	var result = [];
	for (var i = 0; i < times; ++i) {
		result.push(generator());
	}
	return result;
};

export const summaries = [
	{ id: 1, name:"activeMemberToday", label: "Active member today", unit: 'people', number: 888 },
	{ id: 2, name:"newMemberToday", label: "New member today", unit: 'people', number: 88 },
	{ id: 3, name:"totalRechargeToday", label: "Total recharge today", unit: 'yuan', number: 888888 },
	{ id: 4, name:"totalWithdrawalToday", label: "Total withdrawal today", unit: 'yuan', number: 888888 },
	{ id: 5, name:"effectiveBettingToday", label: "Effective betting today", unit: 'yuan', number: 888888 },
	{ id: 6, name:"profitAndLossToday", label: "Profit and loss today", unit: 'yuan', number: 888888 },
];

export function getRandomDepositSystemsValues() {
	let arr = Object.values(depositSystemsValues);
	return arr[casual.integer(0, arr.length - 1)];
}

export function getRandomDepositTypesValues() {
	let arr = Object.values(depositTypesValues);
	return arr[casual.integer(0, arr.length - 1)];
}

export function getRandomStatus() {
	let arr = Object.values(statusesValues);
	return arr[casual.integer(0, arr.length - 1)];
}

export function getRandomWithdrawalTypes() {
	let arr = Object.values(withdrawalTypesValues);
	return arr[casual.integer(0, arr.length - 1)];
}

export function getRandomWithdrawalFeeTypes() {
	let arr = Object.values(withdrawalFeeTypesValues);
	return arr[casual.integer(0, arr.length - 1)];
}

export const provinces = [
	'Hei_Long_Jiang',
	'Ji_Lin',
	'Liao_Ning',
	'He_Bei',
	'Shan_Dong',
	'Jiangsu',
	'An_Hui',
	'He_Nan',
	'Shan1_Xi',
	'Shan3_Xi',
	'Gan_Su',
	'Hu_Bei',
	'Jiang_Xi',
	'Hu_Nan',
	'Gui_Zhou',
	'Si_Chuan',
	'Yun_Nan',
	'Qing_Hai',
	'Hai_Nan',
	'Chong_Qing',
	'Tian_Jin',
	'Bei_Jing',
	'Ning_Xia',
	'Nei_Meng_Gu',
	'Guang_Xi',
	'Xin_Jiang',
	'Xi_Zang',
	'Xizang',
	'Shang_Hai',
	'Fu_Jian',
	'Guang_Dong',
	'Hong_Kong',
	'Macau',
	'Tai_Wan'
]

const custom_provider = {
	province: function() {
		return casual.random_element(provinces);
	},
	deposit_type: function() {
		return getRandomDepositTypesValues();
	},
	deposit_system: function() {
		return getRandomDepositSystemsValues();
	},
	status: function() {
		return getRandomStatus();
	},
	withdrawal_type: function() {
		return getRandomWithdrawalTypes();
	},
	withdrawal_fee_type: function() {
		return getRandomDepositTypesValues();
	}
 };

casual.register_provider(custom_provider);

export { casual }