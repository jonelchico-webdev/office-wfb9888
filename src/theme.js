import {createMuiTheme} from '@material-ui/core';
import msyh from './fonts/msyh';

const grey = {
	50: "#F5F7FA",
	100: "#E4E7EB",
	200: "#CBD2D9",
	300: "#9AA5B1",
	400: "#7B8794",
	500: "#616E7C",
	600: "#52606D",
	700: "#3E4C59",
	800: "#323F4B",
	900: "#1F2933", 
}

const blue = {
	50: "#E4EDFD",
	100: "#BFD6FB",
	200: "#9ABEF9",
	300: "#75A7F6",
	400: "#629BF5",
	500: "#508FF4",
	600: "#3E83F3",
	700: "#2B77F2",
	800: "#196CF1",
	900: "#0F62E7",
}

const red = {
	50: "#FFEEEE",
	100: "#FACDCD",
	200: "#F29B9B",
	300: "#E66A6A",
	400: "#D64545",
	500: "#BA2525",
	600: "#A61B1B",
	700: "#911111",
	800: "#780A0A",
	900: "#610404",
}

const yellow = {
	50: "#FFFAEB",
	100: "#FCEFC7",
	200: "#F8E3A3",
	300: "#F9DA8B",
	400: "#F7D070",
	500: "#E9B949",
	600: "#C99A2E",
	700: "#A27C1A",
	800: "#7C5E10",
	900: "#513C06",
}

const green = {
	50: "#E3F9E5",
	100: "#C1EAC5",
	200: "#A3D9A5",
	300: "#7BC47F",
	400: "#57AE5B",
	500: "#3F9142",
	600: "#2F8132",
	700: "#207227",
	800: "#0E5814",
	900: "#05400A",
}

const teal = {
	50: "#EFFCF6",
	100: "#C6F7E2",
	200: "#8EEDC7",
	300: "#65D6AD",
	400: "#3EBD93",
	500: "#27AB83",
	600: "#199473",
	700: "#147D64",
	800: "#0C6B58",
	900: "#014D40",
}
const borderColor = '#D0DBE5';

const theme = createMuiTheme({
	spacing: 12,
	palette: {
		grey,
		blue,
		teal,
		green,
		yellow,
		primary: {
			light: blue[200],
			main: blue[500],
			dark: blue[700],
			contrastText: '#fff'
		},
		secondary: {
			light: teal[200],
			main: teal[500],
			dark: teal[700],
			contrastText: '#fff'
		},
		error: {
			light: red[200],
			main: red[500],
			dark: red[700]
		},
		background: {
			paper: '#f1f4f9',
			default: '#E3E9F0',
			selectedPrimary: '#E9EEF4',
			selectedSecondary: '#E3E9F0'
		},
		text: {
			primary: 'rgb(82,87,93)',
			secondary: '#B3B8BD',
			primaryOpacity65: 'rgba(82,87,93, 0.65)',
			primaryOpacity85: 'rgba(82,87,93, 0.85)'
		}
	},
	typography: {
		fontSize: 12,
		fontFamily: [
			'"Microsoft YaHei"',
			'Roboto',
			'Open Sans',
			'Lato',
		].join(','),
		subtitle2: {
			fontWeight: 'bold',
		},
		h6: {
			fontWeight: 'bold'
		},
		body2: {
			fontWeight: 'bold'
		}
	},
	layout: {
		radioGroup:{
			maxHeight: 155
		},
		checkBoxGroup:{ 
			maxHeight: 78
		}
	},
	charts: {
		bar: {
			backgroundColors: ["#3bcca6", "#508FF4", "#036cf1"]
		},
		doughnut: {
			backgroundColors: ["#7CC47E", "#FDCB58", "#FE6767", "#BDD6F9", "#3BCCA7", "#7CC47E", "#FDCB58", "#FE6767", "#BDD6F9", "#3BCCA7"]
		}
	},
	props: {
		MuiButtonBase: {
			disableRipple: true,
		},
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				'@font-face': [msyh],
			},
		},
		MuiDivider: {
			light: {
				backgroundColor: '#E3E9F0'
			}
		},
		MuiPaper: {
			elevation1: {
				boxShadow: '0px 2px 4px rgba(126,142,177,0.12)',
				borderRadius: 5
			}
		},
		MuiButton: {
			contained: {
				boxShadow: '0px 2px 4px rgba(126,142,177,0.12)',
				backgroundColor: '#ffffff'
			},
			containedPrimary: {
				'&:hover': {
					backgroundColor: '#4c88e8'
				}
			},
			outlined: {
				boxShadow: '0px 2px 4px rgba(126,142,177,0.12)'
			},
		},
		MuiTableCell: {
			root: {
				'&:last-child': {
					paddingRight: 0,
				},
			},
			head: {
				backgroundColor: '#E3E9F0'
			},
		},
		MuiFormControl: {
			marginDense: {
				marginTop: 4,
				marginBottom: 4
			}
		},
		MuiOutlinedInput: {
			inputMarginDense: {
				paddingTop: 8.86,
				paddingBottom: 8.86,
			},
			input: {
				backgroundColor: "#ffffff  !important"
			}	
		},
		MuiChip: {
			root: {
				borderRadius: 5
			},
			outlined: {
				minWidth: 100
			},
			deleteIcon: {
				margin: '0 -10px 0 10px'
			}
		},
		MuiSelect: {
			icon: {
				right: 6
			}
		},
		MuiAppBar: {
			root: {
				borderBottom: `1px solid ${borderColor}`
			}
		}
	},
});

export default theme;