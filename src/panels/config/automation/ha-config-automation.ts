/* eslint-disable no-console */
import { HassEntities } from "home-assistant-js-websocket";
import { PropertyValues } from "lit";
import { customElement, property } from "lit/decorators";
import memoizeOne from "memoize-one";
import { computeStateDomain } from "../../../common/entity/compute_state_domain";
import { debounce } from "../../../common/util/debounce";
import { AutomationEntity } from "../../../data/automation";
import {
  HassRouterPage,
  RouterOptions,
} from "../../../layouts/hass-router-page";
import { Constructor, HomeAssistant, Resources } from "../../../types";
import "./ha-automation-editor";
import "./ha-automation-picker";
import TranslationsMixin from "../../../state/translations-mixin";
import ThemesMixin from "../../../state/themes-mixin";

const equal = (a: AutomationEntity[], b: AutomationEntity[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((automation, index) => automation === b[index]);
};

const ext = <T extends Constructor>(baseClass: T, mixins): T =>
  mixins.reduceRight((base, mixin) => mixin(base), baseClass);

@customElement("ha-config-automation")
// class HaConfigAutomation extends HassRouterPage {
  class HaConfigAutomation extends  ext(HassRouterPage, [
    ThemesMixin,
    TranslationsMixin,
  ]) {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow = false;

  @property({ type: Boolean }) public isWide = false;

  @property({ type: Boolean }) public showAdvanced = false;

  @property() public automations: AutomationEntity[] = [];

  private resources: Resources = {};

  private localize(key) {
    this.hass.resources = this.resources;
    return this.hass.localize(key);
  }

  private _debouncedUpdateAutomations = debounce((pageEl) => {
    const newAutomations = this._getAutomations(this.hass.states);
    if (!equal(newAutomations, pageEl.automations)) {
      pageEl.automations = newAutomations;
    }
  }, 10);

  protected routerOptions: RouterOptions = {
    defaultPage: "dashboard",
    routes: {
      dashboard: {
        tag: "ha-automation-picker",
        cache: true,
      },
      edit: {
        tag: "ha-automation-editor",
      },
      show: {
        tag: "ha-automation-editor",
      },
      trace: {
        tag: "ha-automation-trace",
        load: () => import("./ha-automation-trace"),
      },
    },
  };

  // private _entitiesContext = new ContextProvider(this, {
  //   context: fullEntitiesContext,
  //   initialValue: [],
  // });

  // public hassSubscribe(): UnsubscribeFunc[] {
  //   return [
  //     subscribeEntityRegistry(this.hass.connection!, (entities) => {
  //       this._entitiesContext.setValue(entities);
  //     }),
  //   ];
  // }

  private _getAutomations = memoizeOne(
    (states: HassEntities): AutomationEntity[] =>
      Object.values(states).filter(
        (entity) =>
          computeStateDomain(entity) === "automation" &&
          !entity.attributes.restored
      ) as AutomationEntity[]
  );

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    // this.hass.loadBackendTranslation("device_automation");
  }

  protected _updateHass(obj: Partial<HomeAssistant>) {
    // console.warn("HCA: _updateHass=" + Object.keys(obj) + "::" + this.shadowRoot);
    // if (!this.hass) {
    //   this._pendingHass = { ...this._pendingHass, ...obj };
    //   return;
    // }
    console.warn("HCA: prima=" + Object.keys(this.hass.resources.en).length);
    this.hass = { ...this.hass, ...obj };
    if (obj.resources) {
      // this.hass.resources = obj.resources;
      // this.hass = { ...this.hass, ...obj };
      console.warn("HCA: " + Object.keys(obj.resources));
      this.resources = obj.resources;
    }
    console.warn("HCA: dopox=" + Object.keys(this.hass.resources.en).length);
    console.warn("HCA: test_state: " + this.localize("ui.panel.config.automation.picker.headers.state"));
    console.warn("HCA: test_triggered: " + this.localize("ui.card.automation.last_triggered"));
   }

  protected updatePageEl(pageEl, changedProps: PropertyValues) {
    // console.warn("updatePageEl");

    // this.localize = function(
    //   key: string,
    //   _values?: Record<
    //     string,
    //     string | number | HTMLTemplateResult | null | undefined
    //   >
    // ): string {
    
    //   let ret = key.split('.').reverse()[0];
    //   if (['caption', 'label', 'description','header'].includes(ret)) {
    //     ret = key.split('.').reverse()[1];
    //   }
    //   return ret;
    // };

    console.warn("HCA: updatePageEl=" + Object.keys(this.hass.resources.en).length);
    console.warn("HCA: test_state: " + this.localize("ui.panel.config.automation.picker.headers.state"));
    console.warn("HCA: test_triggered: " + this.localize("ui.card.automation.last_triggered"));


    pageEl.hass = this.hass;
    pageEl.narrow = this.narrow;
    pageEl.isWide = this.isWide;
    pageEl.route = this.routeTail;
    pageEl.showAdvanced = this.showAdvanced;

    if (this.hass) {
      if (!pageEl.automations || !changedProps) {
        pageEl.automations = this._getAutomations(this.hass.states);
      } else if (changedProps.has("hass")) {
        this._debouncedUpdateAutomations(pageEl);
      }
    }
    if (
      (!changedProps || changedProps.has("route")) &&
      this._currentPage === "show"
    ) {
      const automationId = decodeURIComponent(this.routeTail.path.substr(1));
      pageEl.automationId = null;
      pageEl.entityId = automationId === "new" ? null : automationId;
      return;
    }
    if (
      (!changedProps || changedProps.has("route")) &&
      this._currentPage !== "dashboard"
    ) {
      const automationId = decodeURIComponent(this.routeTail.path.substr(1));
      pageEl.automationId = automationId === "new" ? null : automationId;
      pageEl.entityId = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-config-automation": HaConfigAutomation;
  }
}
