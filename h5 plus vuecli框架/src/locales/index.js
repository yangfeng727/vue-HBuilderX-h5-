import Vue from 'vue'
import VueI18n from 'vue-i18n'
// vant 国际化
import {Locale} from 'vant'
import zh from './zh'
import en from './en'
import enUS from 'vant/lib/locale/lang/en-US'
import zhCN from 'vant/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const DEFAULT_LANG = 'zh-CN'
const LOCALE_KEY = 'localeLanguage'

// 当前系统的语言
const locales = {
  'zh-CN': zh,
  'en-US': en
}
// vant支持的语言-当vant不支持时默认使用英语
const vantLocales = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales,
  fallbackLocale: 'en', // 回退
  silentTranslationWarn: true
})

/**
 *  vant 国际化
 * */
let vantFn = function (lang) {
  // vant 国际化-没有的用英文显示
  let vantLang = 'en-US'
  if (vantLocales[lang]) {
    vantLang = lang
  }
  Locale.use(vantLang, vantLocales[vantLang])
}

export const setup = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY)
    if (locales[lang] === undefined) {
      lang = DEFAULT_LANG
    }
  }

  // Locale.use('en-US', enUS)
  vantFn(lang)

  window.localStorage.setItem(LOCALE_KEY, lang)

  // 样式适配
  // Object.keys(locales).forEach(lang => {
  //   document.body.classList.remove(`lang-${lang}`)
  // })
  // document.body.classList.add(`lang-${lang}`)
  // document.body.setAttribute('lang', lang)

  Vue.config.lang = lang
  i18n.locale = lang
}

setup()
window.i18n = i18n
export default i18n
