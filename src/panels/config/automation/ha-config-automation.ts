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
import { Constructor, HomeAssistant } from "../../../types";
import "./ha-automation-editor";
import "./ha-automation-picker";
import ThemesMixin from "../../../state/themes-mixin";
import { myhass } from "./my-hass";

const equal = (a: AutomationEntity[], b: AutomationEntity[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((automation, index) => automation === b[index]);
};

const ext = <T extends Constructor>(baseClass: T, mixins): T =>
  mixins.reduceRight((base, mixin) => mixin(base), baseClass);

@customElement("ha-config-automation")
class HaConfigAutomation extends  ext(HassRouterPage, [
    ThemesMixin
  ]) {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow = false;

  @property({ type: Boolean }) public isWide = false;

  @property({ type: Boolean }) public showAdvanced = false;

  @property() public automations: AutomationEntity[] = [];

  constructor() {
    super();
    myhass.el = this;
  }

  private _debouncedUpdateAutomations = debounce((pageEl) => {
    const newAutomations = this._getAutomations(this.hass.states);
    if (!equal(newAutomations, pageEl.automations)) {
      pageEl.automations = newAutomations;
    }
  }, 10);

  protected routerOptions: RouterOptions = {
    initialLoad: (() => myhass.update()),
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

  private _getAutomations = memoizeOne(
    (states: HassEntities): AutomationEntity[] =>
      Object.values(states).filter(
        (entity) =>
          computeStateDomain(entity) === "simga_automation" &&
          !entity.attributes.restored
      ) as AutomationEntity[]
  );

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    // this.hass.loadBackendTranslation("device_automation");
  }

  protected updatePageEl(pageEl, changedProps: PropertyValues) {
    //   let ret = key.split('.').reverse()[0];
    //   if (['caption', 'label', 'description','header'].includes(ret)) {
    //     ret = key.split('.').reverse()[1];
    //   }
    //   return ret;
    // };

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
