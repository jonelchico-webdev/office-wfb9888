import React from 'react';

export const EN = "en";
export const ZH = "zh";
export const ZHT = "zh-TW";

export const LanguageContext = React.createContext({
	language: "en",
	setLangauge: () => {}
});