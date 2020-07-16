import MSYH from './msyh.ttf';

const msyh = {
	fontFamily: 'Microsoft YaHei',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 400,
	src: `
		local('Microsoft YaHei'),
		local('Microsoft YaHei Regular'),
		url(${MSYH}) format('ttf')
	`,
	// unicodeRange: 'U+0-10FFFF',
};

export default msyh;