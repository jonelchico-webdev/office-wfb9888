
import {useContext} from 'react';
import languages from '../languages';
import LocalizedStrings from 'react-localization';
import {LanguageContext, ZH, EN} from '../language-context';
import moment from 'moment';
import zhcnLocale from 'moment/locale/zh-cn';
import enIELocale from 'moment/locale/en-ie';

export default function useLanguages(pathName) {
	const {language} = useContext(LanguageContext);
	let strings = new LocalizedStrings(languages[pathName]);
	if(language) {
		strings.setLanguage(language);
		if(language === ZH) {
			moment.locale('zh-cn', zhcnLocale);
		}
		else if(language === EN) {
			moment.locale('en', enIELocale);
		}
	}
	return strings;
}

