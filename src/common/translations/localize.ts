import { shouldPolyfill as shouldPolyfillLocale } from "@formatjs/intl-locale/lib/should-polyfill";
import { shouldPolyfill as shouldPolyfillPluralRules } from "@formatjs/intl-pluralrules/lib/should-polyfill";
import { shouldPolyfill as shouldPolyfillRelativeTime } from "@formatjs/intl-relativetimeformat/lib/should-polyfill";
import { shouldPolyfill as shouldPolyfillDateTime } from "@formatjs/intl-datetimeformat/lib/should-polyfill";
import IntlMessageFormat from "intl-messageformat";
import { Resources, TranslationDict } from "../../types";
import { getLocalLanguage } from "../../util/common-translation";
// import { getTranslation } from "../../util/common-translation";
// import { HomeAssistantAppEl } from "../../layouts/home-assistant";
// import { CircularProgress } from "@material/mwc-circular-progress";

// Exclude some patterns from key type checking for now
// These are intended to be removed as errors are fixed
// Fixing component category will require tighter definition of types from backend and/or web socket
export type LocalizeKeys =
  | FlattenObjectKeys<Omit<TranslationDict, "supervisor">>
  | `panel.${string}`
  | `ui.card.alarm_control_panel.${string}`
  | `ui.card.weather.attributes.${string}`
  | `ui.card.weather.cardinal_direction.${string}`
  | `ui.components.calendar.event.rrule.${string}`
  | `ui.components.logbook.${string}`
  | `ui.components.selectors.file.${string}`
  | `ui.dialogs.entity_registry.editor.${string}`
  | `ui.dialogs.more_info_control.vacuum.${string}`
  | `ui.dialogs.quick-bar.commands.${string}`
  | `ui.dialogs.unhealthy.reason.${string}`
  | `ui.dialogs.unsupported.reason.${string}`
  | `ui.panel.config.${string}.${"caption" | "description"}`
  | `ui.panel.config.automation.${string}`
  | `ui.panel.config.dashboard.${string}`
  | `ui.panel.config.devices.${string}`
  | `ui.panel.config.energy.${string}`
  | `ui.panel.config.info.${string}`
  | `ui.panel.config.lovelace.${string}`
  | `ui.panel.config.network.${string}`
  | `ui.panel.config.scene.${string}`
  | `ui.panel.config.zha.${string}`
  | `ui.panel.config.zwave_js.${string}`
  | `ui.panel.lovelace.card.${string}`
  | `ui.panel.lovelace.editor.${string}`
  | `ui.panel.page-authorize.form.${string}`
  | `component.${string}`;

// Tweaked from https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types
export type FlattenObjectKeys<
  T extends Record<string, any>,
  Key extends keyof T = keyof T
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

export type LocalizeFunc<Keys extends string = LocalizeKeys> = (
  key: Keys,
  ...args: any[]
) => string;

interface FormatType {
  [format: string]: any;
}
export interface FormatsType {
  number: FormatType;
  date: FormatType;
  time: FormatType;
}

const loadedPolyfillLocale = new Set();

const locale = getLocalLanguage();

const polyfills: Promise<any>[] = [];
if (__BUILD__ === "latest") {
  if (shouldPolyfillLocale()) {
    await import("@formatjs/intl-locale/polyfill");
  }
  if (shouldPolyfillPluralRules(locale)) {
    polyfills.push(import("@formatjs/intl-pluralrules/polyfill"));
    polyfills.push(import("@formatjs/intl-pluralrules/locale-data/en"));
  }
  if (shouldPolyfillRelativeTime(locale)) {
    polyfills.push(import("@formatjs/intl-relativetimeformat/polyfill"));
  }
  if (shouldPolyfillDateTime(locale)) {
    polyfills.push(import("@formatjs/intl-datetimeformat/polyfill"));
    polyfills.push(import("@formatjs/intl-datetimeformat/add-all-tz"));
  }
}

export const polyfillsLoaded =
  polyfills.length === 0
    ? undefined
    : Promise.all(polyfills).then(() =>
        // Load the default language
        loadPolyfillLocales(locale)
      );

/**
 * Adapted from Polymer app-localize-behavior.
 *
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * Optional dictionary of user defined formats, as explained here:
 * http://formatjs.io/guides/message-syntax/#custom-formats
 *
 * For example, a valid dictionary of formats would be:
 * this.formats = {
 *    number: { USD: { style: 'currency', currency: 'USD' } }
 * }
 */

export const computeLocalize = async <Keys extends string = LocalizeKeys>(
  cache: any,
  language: string,
  resources: Resources,
  formats?: FormatsType
): Promise<LocalizeFunc<Keys>> => {
  if (polyfillsLoaded) {
    await polyfillsLoaded;
  }

  await loadPolyfillLocales(language);

  // Every time any of the parameters change, invalidate the strings cache.
  cache._localizationCache = {};

  return (key, ...args) => {
    if (!key || !resources || !language || !resources[language]) {
      return "";
    }

    // Cache the key/value pairs for the same language, so that we don't
    // do extra work if we're just reusing strings across an application.
    const translatedValue = resources[language][key];

    if (!translatedValue) {
      return "";
    }

    const messageKey = key + translatedValue;
    let translatedMessage = cache._localizationCache[messageKey] as
      | IntlMessageFormat
      | undefined;

    if (!translatedMessage) {
      try {
        translatedMessage = new IntlMessageFormat(
          translatedValue,
          language,
          formats
        );
      } catch (err: any) {
        return "Translation error: " + err.message;
      }
      cache._localizationCache[messageKey] = translatedMessage;
    }

    let argObject = {};
    if (args.length === 1 && typeof args[0] === "object") {
      argObject = args[0];
    } else {
      for (let i = 0; i < args.length; i += 2) {
        argObject[args[i]] = args[i + 1];
      }
    }

    try {
      return translatedMessage.format<string>(argObject) as string;
    } catch (err: any) {
      return "Translation " + err;
    }
  };
};

export const loadPolyfillLocales = async (language: string) => {
  if (loadedPolyfillLocale.has(language)) {
    return;
  }
  loadedPolyfillLocale.add(language);
  try {
    if (
      Intl.NumberFormat &&
      // @ts-ignore
      typeof Intl.NumberFormat.__addLocaleData === "function"
    ) {
      const result = await fetch(
        `/static/locale-data/intl-numberformat/${language}.json`
      );
      // @ts-ignore
      Intl.NumberFormat.__addLocaleData(await result.json());
    }
    if (
      Intl.RelativeTimeFormat &&
      // @ts-ignore
      typeof Intl.RelativeTimeFormat.__addLocaleData === "function"
    ) {
      const result = await fetch(
        `/static/locale-data/intl-relativetimeformat/${language}.json`
      );
      // @ts-ignore
      Intl.RelativeTimeFormat.__addLocaleData(await result.json());
    }
    if (
      Intl.DateTimeFormat &&
      // @ts-ignore
      typeof Intl.DateTimeFormat.__addLocaleData === "function"
    ) {
      const result = await fetch(
        `/static/locale-data/intl-datetimeformat/${language}.json`
      );
      // @ts-ignore
      Intl.DateTimeFormat.__addLocaleData(await result.json());
    }
  } catch (e) {
    // Ignore
  }
};

// const _initializeLocalize = (c) => {
//   const { language, data } = getTranslation(
//     null,
//     "en",
//     "/api/hassio/app/static/translations"
//   );

//   c.myhass.localize = computeLocalize(
//     null,
//     language,
//     {
//       [language]: data,
//     }
//   );
//   // return localize;
// }

export class MyHassClass {
  // @property() public localize: LocalizeFunc;

  // public constructor() {
  //   this.localize = this.mylocalize;
  // }

  public localize(key: LocalizeKeys, ..._args: any[]) {
    switch (key) {
      case "ui.panel.config.automation.caption":
        return "Automations";
      case "ui.panel.config.scene.caption":
        return "Scenes";
      case "ui.panel.config.script.caption":
        return "Scripts";
      case "ui.panel.config.blueprint.caption":
        return "Blueprints";
      case "ui.panel.config.automation.picker.headers.name":
        return "Name";
      case "ui.card.automation.last_triggered":
        return "Last triggered";
      case "ui.panel.config.automation.picker.no_automations":
        return "We couldn't find any automations";
      case "ui.panel.config.automation.picker.add_automation":
        return "Create Simga automation";

      case "ui.panel.config.automation.editor.triggers.header":
        return "Triggers";
      case "ui.panel.config.automation.editor.triggers.add":
        return "add trigger";
      case "ui.panel.config.automation.editor.conditions.header":
        return "Conditions";
      case "ui.panel.config.automation.editor.conditions.add":
        return "Add condition";
      case "ui.panel.config.automation.editor.actions.header":
        return "Actions";
      case "ui.panel.config.automation.editor.actions.add":
        return "Add Action";
      case "ui.panel.config.automation.editor.save":
        return "Save";
      case "ui.panel.config.automation.editor.triggers.rename":
        return "Rename";
      case "ui.panel.config.automation.editor.triggers.re_order":
        return "Re-order";
      case "ui.panel.config.automation.editor.triggers.duplicate":
        return "Duplicate";
      case "ui.panel.config.automation.editor.triggers.edit_id":
        return "Edit ID";
      case "ui.panel.config.automation.editor.edit_yaml":
        return "Edit in YAML";
      case "ui.panel.config.automation.editor.edit_ui":
        return "Edit in visual editor";
      case "ui.panel.config.automation.editor.actions.disable":
        return "Disable";
      case "ui.panel.config.automation.editor.actions.delete":
        return "Delete";
      case "ui.panel.config.automation.editor.triggers.type.device.trigger":
        return "Trigger";
      case "ui.panel.config.automation.editor.actions.type.device_id.action":
        return "Action";
      case "ui.panel.config.automation.editor.show_info":
        return "Information";
      case "ui.panel.config.automation.editor.run":
        return "Run";
      case "ui.panel.config.automation.editor.show_trace":
        return "Traces";
      case "ui.panel.config.automation.picker.duplicate":
        return "Duplicate";
      case "ui.panel.config.automation.editor.disable":
        return "Disable";
      case "ui.panel.config.automation.picker.delete":
        return "Delete";
      case "ui.components.relative_time.never":
        return "Never";

      case "ui.panel.config.automation.editor.default_name":
        return "New Automation";
      case "ui.panel.config.automation.editor.alias":
        return "Name";
      case "ui.panel.config.automation.editor.description.placeholder":
        return "Optional Description";
      case "ui.dialogs.generic.cancel":
        return "Cancel";

      case "ui.panel.config.automation.editor.rename":
        return "Rename";
      case "ui.panel.config.automation.editor.unsaved_confirm_title":
        return "Leave editor";
      case "ui.panel.config.automation.editor.unsaved_confirm_text":
        return "Unsaved changes will be losy";
      case "ui.common.stay":
        return "Stay";
      case "ui.common.leave":
        return "Leave";

      default:
        if (key.endsWith(".label")) {
          const ret: string = key.split(".").slice(-2, -1)[0].replace("_", " ");
          return ret.charAt(0).toUpperCase() + ret.slice(1);
        }
        return "???" + key;
    }
  }

  // public localize (key: LocalizeKeys, ..._args: any[]) {
  //   // code for anonymousn function
  //   // const v : string = HaConfigAutomation.localize_rel(key);
  //   // if (v) {
  //   //   return v;
  //   // }
  //   // let x : string;

  //   // (async() => {
  //   //   const locali : LocalizeFunc = await _initializeLocalize();
  //   //   let x = "miaoo:" + locali(key);
  //   // })(); // .then((res) => {x=res;return x});

  //   // return x;
  //   return "miaoo:" + key;
  // };
}

export const myhass: MyHassClass = new MyHassClass();
