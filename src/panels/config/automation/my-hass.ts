/* eslint-disable no-console */
// import { ContextProvider } from "@lit-labs/context";
// import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { HomeAssistant } from "../../../types";

// import { atLeastVersion } from "../../../common/config/version";
import { computeLocalize, LocalizeFunc } from "../../../common/translations/localize";
// import {
//   getHassTranslations,
//   getHassTranslationsPre109,
// } from "../../../data/translation";
import { translationMetadata } from "../../../resources/translations-metadata";
import {
  getLocalLanguage,
  getTranslation,
} from "../../../util/common-translation";
// import { fullEntitiesContext } from "../../../data/context";
// import { subscribeEntityRegistry } from "../../../data/entity_registry";

declare global {
  // for fire event
  interface HASSDomEvents {
    "hass-language-select": {
      language: string;
    };
    // "hass-number-format-select": {
    //   number_format: NumberFormat;
    // };
    // "hass-time-format-select": {
    //   time_format: TimeFormat;
    // };
    // "hass-date-format-select": {
    //   date_format: DateFormat;
    // };
    // "hass-time-zone-select": {
    //   time_zone: TimeZone;
    // };
    // "hass-first-weekday-select": {
    //   first_weekday: FirstWeekday;
    // };
    "translations-updated": undefined;
  }
}

// interface LoadedTranslationCategory {
//   // individual integrations loaded for this category
//   integrations: string[];
//   // if integrations that have been set up for this category are loaded
//   setup: boolean;
//   // if
//   configFlow: boolean;
// }

let updateResourcesIteration = 0;

/*
 * superClass needs to contain `this.el.hass` and `this._updateHass`.
 */

// @customElement("my-hass")
class MyHass {
    // public hass: HomeAssistant | undefined;

    public el: any = undefined;

    // public localize_init(_key: LocalizeKeys): string {
    //   myhass.firstUpdated(this.el.hass);
    //   return "this.localize(key)";
    // }

    // constructor(parent) {
    //   this.el = parent;
    // }

    public localize: LocalizeFunc = (() => "??");

    // export default <T extends Constructor<LitElement>>(superClass: T) =>
    // class extends superClass {
    // eslint-disable-next-line: variable-name
    private __coreProgress?: string;

    private __loadedFragmetTranslations: Set<string> = new Set();

    // private __loadedTranslations: {
    //   // track what things have been loaded
    //   [category: string]: LoadedTranslationCategory;
    // } = {};

    public async update() {

      await this._loadCoreTranslations(getLocalLanguage());

      // await this.updated();
      this.localize = await this._loadFragmentTranslations(this.el.hass!.language, this.el.hass!.panelUrl) || (() => "!!");

      // const _entitiesContext = new ContextProvider(this.el, {
      //   context: fullEntitiesContext,
      //   initialValue: [],
      // });

      // // sottoscrive le entities e assegna "_entityReg"
      // subscribeEntityRegistry(this.el.hass.connection!, (entities) => {
      //   _entitiesContext.setValue(entities);
      // })
    }

    // public hassSubscribe(): UnsubscribeFunc[] {
    //   const _entitiesContext = new ContextProvider(this.el, {
    //     context: fullEntitiesContext,
    //     initialValue: [],
    //   });
    //     return [
    //     subscribeEntityRegistry(this.el.hass.connection!, (entities) => {
    //       _entitiesContext.setValue(entities);
    //     }),
    //   ];
    // }
  
    public firstUpdated(_hass: HomeAssistant) {
      // this.el.hass = hass;

      // super.firstUpdated(changedProps);
      // this.addEventListener("hass-language-select", (e) => {
      //   this._selectLanguage((e as CustomEvent).detail, true);
      // });
      // this.addEventListener("hass-number-format-select", (e) => {
      //   this._selectNumberFormat((e as CustomEvent).detail, true);
      // });
      // this.addEventListener("hass-time-format-select", (e) => {
      //   this._selectTimeFormat((e as CustomEvent).detail, true);
      // });
      // this.addEventListener("hass-date-format-select", (e) => {
      //   this._selectDateFormat((e as CustomEvent).detail, true);
      // });
      // this.addEventListener("hass-time-zone-select", (e) => {
      //   this._selectTimeZone((e as CustomEvent).detail, true);
      // });
      // this.addEventListener("hass-first-weekday-select", (e) => {
      //   this._selectFirstWeekday((e as CustomEvent).detail, true);
      // });
      this._loadCoreTranslations(getLocalLanguage());

      this.updated();
    }

    protected async updated() {
      console.warn("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4");
      // super.updated(changedProps);

      // const oldHass = changedProps.get("hass") as HomeAssistant | undefined;

      // if (
      //   this.el.hass?.panels &&
      //   (!oldHass || oldHass.panels !== this.el.hass.panels)
      // ) {
        this._loadFragmentTranslations(this.el.hass!.language, this.el.hass!.panelUrl)
        .then(
          (localize) => {
            console.warn("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA11" + localize);
            // if (oldHass && localize) {
              if (localize) {
                this.localize = localize;
              }

              // console.warn("localize(state)=" + localize("ui.panel.config.automation.picker.headers.state"));
            // }
          });
      // }
    }

    // protected hassConnected() {
    //   super.hassConnected();
    //   getUserLocale(this.el.hass!).then((locale) => {
    //     if (locale?.language && this.el.hass!.language !== locale.language) {
    //       // We just got language from backend, no need to save back
    //       this._selectLanguage(locale.language, false);
    //     }
    //     if (
    //       locale?.number_format &&
    //       this.el.hass!.locale.number_format !== locale.number_format
    //     ) {
    //       // We just got number_format from backend, no need to save back
    //       this._selectNumberFormat(locale.number_format, false);
    //     }
    //     if (
    //       locale?.time_format &&
    //       this.el.hass!.locale.time_format !== locale.time_format
    //     ) {
    //       // We just got time_format from backend, no need to save back
    //       this._selectTimeFormat(locale.time_format, false);
    //     }
    //     if (
    //       locale?.date_format &&
    //       this.el.hass!.locale.date_format !== locale.date_format
    //     ) {
    //       // We just got date_format from backend, no need to save back
    //       this._selectDateFormat(locale.date_format, false);
    //     }
    //     if (
    //       locale?.time_zone &&
    //       this.el.hass!.locale.time_zone !== locale.time_zone
    //     ) {
    //       // We just got time_zone from backend, no need to save back
    //       this._selectTimeZone(locale.time_zone, false);
    //     }
    //     if (
    //       locale?.first_weekday &&
    //       this.el.hass!.locale.first_weekday !== locale.first_weekday
    //     ) {
    //       // We just got first_weekday from backend, no need to save back
    //       this._selectFirstWeekday(locale.first_weekday, false);
    //     }
    //   });

    //   this.el.hass!.connection.subscribeEvents(
    //     debounce(() => {
    //       this._refetchCachedHassTranslations(false, false);
    //     }, 500),
    //     "component_loaded"
    //   );
    //   this._applyTranslations(this.el.hass!);
    // }

    // protected hassReconnected() {
    //   super.hassReconnected();
    //   this._refetchCachedHassTranslations(true, false);
    //   this._applyTranslations(this.el.hass!);
    // }

    // protected panelUrlChanged(newPanelUrl: string) {
    //   super.panelUrlChanged(newPanelUrl);
    //   // this may be triggered before hassConnected
    //   this._loadFragmentTranslations(
    //     this.el.hass ? this.el.hass.language : getLocalLanguage(),
    //     newPanelUrl
    //   );
    // }

    // private _selectNumberFormat(
    //   number_format: NumberFormat,
    //   saveToBackend: boolean
    // ) {
    //   this._updateHass({
    //     locale: { ...this.el.hass!.locale, number_format: number_format },
    //   });
    //   if (saveToBackend) {
    //     saveTranslationPreferences(this.el.hass!, this.el.hass!.locale);
    //   }
    // }

    // private _selectTimeFormat(time_format: TimeFormat, saveToBackend: boolean) {
    //   this._updateHass({
    //     locale: { ...this.el.hass!.locale, time_format: time_format },
    //   });
    //   if (saveToBackend) {
    //     saveTranslationPreferences(this.el.hass!, this.el.hass!.locale);
    //   }
    // }

    // private _selectDateFormat(date_format: DateFormat, saveToBackend: boolean) {
    //   this._updateHass({
    //     locale: {
    //       ...this.el.hass!.locale,
    //       date_format: date_format,
    //     },
    //   });
    //   if (saveToBackend) {
    //     saveTranslationPreferences(this.el.hass!, this.el.hass!.locale);
    //   }
    // }

    // private _selectTimeZone(time_zone: TimeZone, saveToBackend: boolean) {
    //   this._updateHass({
    //     locale: { ...this.el.hass!.locale, time_zone },
    //   });
    //   if (saveToBackend) {
    //     saveTranslationPreferences(this.el.hass!, this.el.hass!.locale);
    //   }
    // }

    // private _selectFirstWeekday(
    //   first_weekday: FirstWeekday,
    //   saveToBackend: boolean
    // ) {
    //   this._updateHass({
    //     locale: { ...this.el.hass!.locale, first_weekday: first_weekday },
    //   });
    //   if (saveToBackend) {
    //     saveTranslationPreferences(this.el.hass!, this.el.hass!.locale);
    //   }
    // }

    // private _selectLanguage(language: string, saveToBackend: boolean) {
    //   if (!this.el.hass) {
    //     // should not happen, do it to avoid use this.el.hass!
    //     return;
    //   }

    //   // update selectedLanguage so that it can be saved to local storage
    //   this._updateHass({
    //     locale: { ...this.el.hass!.locale, language: language },
    //     language: language,
    //     selectedLanguage: language,
    //   });
    //   storeState(this.el.hass);
    //   if (saveToBackend) {
    //     saveTranslationPreferences(this.el.hass, this.el.hass.locale);
    //   }
    //   this._applyTranslations(this.el.hass);
    //   this._refetchCachedHassTranslations(true, true);
    // }

    // private _applyTranslations(hass: HomeAssistant) {
    //   document.querySelector("html")!.setAttribute("lang", hass.language);
    //   this._applyDirection(hass);
    //   this._loadCoreTranslations(hass.language);
    //   this.__loadedFragmetTranslations = new Set();
    //   this._loadFragmentTranslations(hass.language, hass.panelUrl);
    // }

    // private _applyDirection(hass: HomeAssistant) {
    //   const direction = computeRTLDirection(hass);
    //   setDirectionStyles(direction, this);
    // }

    /**
     * Load translations from the backend
     * @param language language to fetch
     * @param category category to fetch
     * @param integration optional, if having to fetch for specific integration
     * @param configFlow optional, if having to fetch for all integrations with a config flow
     * @param force optional, load even if already cached
     */
    // private async _loadHassTranslations(
    //   language: string,
    //   category: Parameters<typeof getHassTranslations>[2],
    //   integration?: Parameters<typeof getHassTranslations>[3],
    //   configFlow?: Parameters<typeof getHassTranslations>[4],
    //   force = false
    // ): Promise<LocalizeFunc> {
    //   if (
    //     __BACKWARDS_COMPAT__ &&
    //     !atLeastVersion(this.el.hass!.connection.haVersion, 0, 109)
    //   ) {
    //     if (category !== "state") {
    //       return this.el.hass!.localize;
    //     }
    //     const resources = await getHassTranslationsPre109(this.el.hass!, language);

    //     // Ignore the repsonse if user switched languages before we got response
    //     if (this.el.hass!.language !== language) {
    //       return this.el.hass!.localize;
    //     }

    //     return this._updateResources(language, resources);
    //   }

    //   let alreadyLoaded: LoadedTranslationCategory;

    //   if (category in this.__loadedTranslations) {
    //     alreadyLoaded = this.__loadedTranslations[category];
    //   } else {
    //     alreadyLoaded = this.__loadedTranslations[category] = {
    //       integrations: [],
    //       setup: false,
    //       configFlow: false,
    //     };
    //   }

    //   let integrationsToLoad: string[] = [];

    //   // Check if already loaded
    //   if (!force) {
    //     if (integration && Array.isArray(integration)) {
    //       integrationsToLoad = integration.filter(
    //         (i) => !alreadyLoaded.integrations.includes(i)
    //       );
    //       if (!integrationsToLoad.length) {
    //         return this.el.hass!.localize;
    //       }
    //     } else if (integration) {
    //       if (alreadyLoaded.integrations.includes(integration)) {
    //         return this.el.hass!.localize;
    //       }
    //       integrationsToLoad = [integration];
    //     } else if (
    //       configFlow ? alreadyLoaded.configFlow : alreadyLoaded.setup
    //     ) {
    //       return this.el.hass!.localize;
    //     }
    //   }

    //   // Add to cache
    //   if (integrationsToLoad.length) {
    //     alreadyLoaded.integrations.push(...integrationsToLoad);
    //   } else {
    //     alreadyLoaded.setup = true;
    //     if (configFlow) {
    //       alreadyLoaded.configFlow = true;
    //     }
    //   }

    //   const resources = await getHassTranslations(
    //     this.el.hass!,
    //     language,
    //     category,
    //     integrationsToLoad.length ? integrationsToLoad : undefined,
    //     configFlow
    //   );

    //   // Ignore the repsonse if user switched languages before we got response
    //   if (this.el.hass!.language !== language) {
    //     return this.el.hass!.localize;
    //   }

    //   return this._updateResources(language, resources);
    // }

    private async _loadFragmentTranslations(
      language: string,
      panelUrl: string
    ) {
      if (!panelUrl) {
        return undefined;
      }

      const panelComponent = this.el.hass?.panels?.[panelUrl]?.component_name;

      // If it's the first call we don't have panel info yet to check the component.
      const fragment = translationMetadata.fragments.includes(
        panelComponent || panelUrl
      )
        ? panelComponent || panelUrl
        : undefined;

      if (!fragment) {
        return undefined;
      }

      if (this.__loadedFragmetTranslations.has(fragment)) {
        return this.localize;
      }
      this.__loadedFragmetTranslations.add(fragment);
      const result = await getTranslation(fragment, language);
      return this._updateResources(result.language, result.data);
    }

    private async _loadCoreTranslations(language: string) {
      // Check if already in progress
      // Necessary as we call this in firstUpdated and hassConnected
      if (this.__coreProgress === language) {
        return;
      }
      this.__coreProgress = language;
      try {
        const result = await getTranslation(null, language);
        await this._updateResources(result.language, result.data);
      } finally {
        this.__coreProgress = undefined;
      }
    }

    private async _updateResources(
      language: string,
      data: any
    ): Promise<LocalizeFunc> {
      updateResourcesIteration++;
      const i = updateResourcesIteration;

      // Update the language in hass, and update the resources with the newly
      // loaded resources. This merges the new data on top of the old data for
      // this language, so that the full translation set can be loaded across
      // multiple fragments.
      //
      // Beware of a subtle race condition: it is possible to get here twice
      // before this.el.hass is even created. In this case our base state comes
      // from this._pendingHass instead. Otherwise the first set of strings is
      // overwritten when we call _updateHass the second time!

      // Allow hass to be updated
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      console.warn("OOOOOOOOOOOOOOOOOOOOOOOOOO4: " + language + " != " + this.el.hass!.language);
      if (language !== this.el.hass!.language) {
        // the language was changed, abort
        return this.el.hass!.localize!;
        // this.el.hass!.language = language;
      }

      const resources = {
        [language]: {
          ...this.el.hass!.resources?.[language],
          ...data,
        },
      };

      // Update resources immediately, so when a new update comes in we don't miss values
      // this._updateHass({ resources });

      const localize = await computeLocalize(this, language, resources);

      if (
        updateResourcesIteration !== i ||
        language !== this.el.hass!.language
      ) {
        // if a new iteration has started or the language changed, abort
        return localize;
      }

      // this._updateHass({
      //   localize,
      // });
      // fireEvent(this, "translations-updated");

      return localize;
    }

    // private _refetchCachedHassTranslations(
    //   includeConfigFlow: boolean,
    //   clearIntegrations: boolean
    // ) {
    //   for (const [category, cache] of Object.entries(
    //     this.__loadedTranslations
    //   )) {
    //     if (clearIntegrations) {
    //       cache.integrations = [];
    //     }
    //     if (cache.setup) {
    //       this._loadHassTranslations(
    //         this.el.hass!.language,
    //         category as TranslationCategory,
    //         undefined,
    //         includeConfigFlow && cache.configFlow,
    //         true
    //       );
    //     }
    //   }
    // }
  };

// Load selected translation into memory immediately so it is ready when Polymer
// initializes.
getTranslation(null, getLocalLanguage());


export const myhass: MyHass = new MyHass;

declare global {
    interface HTMLElementTagNameMap {
      "my-hass": MyHass;
    }
  }

