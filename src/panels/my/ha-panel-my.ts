import { sanitizeUrl } from "@braintree/sanitize-url";
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import { isComponentLoaded } from "../../common/config/is_component_loaded";
import {
  protocolIntegrationPicked,
  PROTOCOL_INTEGRATIONS,
} from "../../common/integrations/protocolIntegrationPicked";
import { navigate } from "../../common/navigate";
import {
  createSearchParam,
  extractSearchParamsObject,
} from "../../common/url/search-params";
import { domainToName } from "../../data/integration";
import "../../layouts/hass-error-screen";
import { HomeAssistant, Route } from "../../types";
import { documentationUrl } from "../../util/documentation-url";

export const getMyRedirects = (hasSupervisor: boolean): Redirects => ({
  application_credentials: {
    redirect: "/my-giulio/application_credentials",
  },
  developer_states: {
    redirect: "/developer-tools/state",
  },
  developer_services: {
    redirect: "/developer-tools/service",
  },
  developer_call_service: {
    redirect: "/developer-tools/service",
    params: {
      service: "string",
    },
  },
  developer_template: {
    redirect: "/developer-tools/template",
  },
  developer_events: {
    redirect: "/developer-tools/event",
  },
  developer_statistics: {
    redirect: "/developer-tools/statistics",
  },
  server_controls: {
    redirect: "/developer-tools/yaml",
  },
  calendar: {
    component: "calendar",
    redirect: "/calendar",
  },
  config: {
    redirect: "/my-giulio/dashboard",
  },
  cloud: {
    component: "cloud",
    redirect: "/my-giulio/cloud",
  },
  config_flow_start: {
    redirect: "/my-giulio/integrations/add",
    params: {
      domain: "string",
    },
  },
  brand: {
    redirect: "/my-giulio/integrations/add",
    params: {
      brand: "string",
    },
  },
  integrations: {
    redirect: "/my-giulio/integrations",
  },
  config_mqtt: {
    component: "mqtt",
    redirect: "/my-giulio/mqtt",
  },
  config_zha: {
    component: "zha",
    redirect: "/my-giulio/zha/dashboard",
  },
  config_zwave_js: {
    component: "zwave_js",
    redirect: "/my-giulio/zwave_js/dashboard",
  },
  add_zigbee_device: {
    component: "zha",
    redirect: "/my-giulio/zha/add",
  },
  add_zwave_device: {
    component: "zwave_js",
    redirect: "/my-giulio/zwave_js/add",
  },
  add_matter_device: {
    component: "matter",
    redirect: "/my-giulio/matter/add",
  },
  config_energy: {
    component: "energy",
    redirect: "/my-giulio/energy/dashboard",
  },
  devices: {
    redirect: "/my-giulio/devices/dashboard",
  },
  entities: {
    redirect: "/my-giulio/entities",
  },
  energy: {
    component: "energy",
    redirect: "/energy",
  },
  areas: {
    redirect: "/my-giulio/areas/dashboard",
  },
  blueprint_import: {
    component: "blueprint",
    redirect: "/my-giulio/blueprint/dashboard/import",
    params: {
      blueprint_url: "url",
    },
  },
  blueprints: {
    component: "blueprint",
    redirect: "/my-giulio/blueprint/dashboard",
  },
  automations: {
    component: "automation",
    redirect: "/my-giulio/dashboard",
  },
  scenes: {
    component: "scene",
    redirect: "/my-giulio/scene/dashboard",
  },
  scripts: {
    component: "script",
    redirect: "/my-giulio/script/dashboard",
  },
  helpers: {
    redirect: "/my-giulio/helpers",
  },
  tags: {
    component: "tag",
    redirect: "/my-giulio/tags",
  },
  lovelace_dashboards: {
    component: "lovelace",
    redirect: "/my-giulio/lovelace/dashboards",
  },
  lovelace_resources: {
    component: "lovelace",
    redirect: "/my-giulio/lovelace/resources",
  },
  oauth: {
    redirect: "/auth/external/callback",
    navigate_outside_spa: true,
    params: {
      error: "string?",
      code: "string?",
      state: "string",
    },
  },
  people: {
    component: "person",
    redirect: "/my-giulio/person",
  },
  zones: {
    component: "zone",
    redirect: "/my-giulio/zone",
  },
  users: {
    redirect: "/my-giulio/users",
  },
  general: {
    redirect: "/my-giulio/general",
  },
  logs: {
    redirect: "/my-giulio/logs",
  },
  repairs: {
    component: "repairs",
    redirect: "/my-giulio/repairs",
  },
  info: {
    redirect: "/my-giulio/info",
  },
  system_health: {
    redirect: "/my-giulio/repairs?dialog=system-health",
  },
  hardware: {
    redirect: "/my-giulio/hardware",
  },
  storage: {
    redirect: "/my-giulio/storage",
  },
  network: {
    redirect: "/my-giulio/network",
  },
  analytics: {
    redirect: "/my-giulio/analytics",
  },
  updates: {
    redirect: "/my-giulio/updates",
  },
  system_dashboard: {
    redirect: "/my-giulio/system",
  },
  customize: {
    // customize was removed in 2021.12, fallback to dashboard
    redirect: "/my-giulio/dashboard",
  },
  profile: {
    redirect: "/profile",
  },
  logbook: {
    component: "logbook",
    redirect: "/logbook",
  },
  history: {
    component: "history",
    redirect: "/history",
  },
  media_browser: {
    component: "media_source",
    redirect: "/media-browser",
  },
  backup: {
    component: hasSupervisor ? "hassio" : "backup",
    redirect: hasSupervisor ? "/hassio/backups" : "/my-giulio/backup",
  },
  supervisor_snapshots: {
    component: hasSupervisor ? "hassio" : "backup",
    redirect: hasSupervisor ? "/hassio/backups" : "/my-giulio/backup",
  },
  supervisor_backups: {
    component: hasSupervisor ? "hassio" : "backup",
    redirect: hasSupervisor ? "/hassio/backups" : "/my-giulio/backup",
  },
  supervisor_system: {
    // Moved from Supervisor panel in 2022.5
    redirect: "/my-giulio/system",
  },
  supervisor_logs: {
    // Moved from Supervisor panel in 2022.5
    redirect: "/my-giulio/logs",
  },
  supervisor_info: {
    // Moved from Supervisor panel in 2022.5
    redirect: "/my-giulio/info",
  },
  hacs_repository: {
    component: "hacs",
    redirect: "/hacs/_my_redirect/hacs_repository",
    params: {
      owner: "string",
      repository: "string",
      category: "string?",
    },
  },
});

const getRedirect = (
  path: string,
  hasSupervisor: boolean
): Redirect | undefined => getMyRedirects(hasSupervisor)?.[path];

export type ParamType = "url" | "string" | "string?";

export type Redirects = { [key: string]: Redirect };
export interface Redirect {
  redirect: string;
  // Set to True to use browser redirect instead of frontend navigation
  navigate_outside_spa?: boolean;
  component?: string;
  params?: {
    [key: string]: ParamType;
  };
  optional_params?: {
    [key: string]: ParamType;
  };
}

@customElement("ha-panel-my")
class HaPanelMy extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public route!: Route;

  @state() public _error?: string;

  private _redirect?: Redirect;

  connectedCallback() {
    super.connectedCallback();
    const path = this.route.path.substring(1);
    const hasSupervisor = isComponentLoaded(this.hass, "hassio");

    this._redirect = getRedirect(path, hasSupervisor);

    if (path.startsWith("supervisor") && this._redirect === undefined) {
      if (!hasSupervisor) {
        this._error = "no_supervisor";
        return;
      }
      navigate(`/hassio/_my_redirect/${path}${window.location.search}`, {
        replace: true,
      });
      return;
    }

    if (!this._redirect) {
      this._error = "not_supported";
      return;
    }

    if (
      this._redirect.component &&
      !isComponentLoaded(this.hass, this._redirect.component)
    ) {
      this.hass.loadBackendTranslation("title", this._redirect.component);
      this._error = "no_component";
      const component = this._redirect.component;
      if (
        (PROTOCOL_INTEGRATIONS as ReadonlyArray<string>).includes(component)
      ) {
        const params = extractSearchParamsObject();
        this.hass
          .loadFragmentTranslation("config")
          .then()
          .then(() => {
            protocolIntegrationPicked(this, this.hass, component, {
              domain: params.domain,
              brand: params.brand,
            });
          });
      }
      return;
    }

    let url: string;
    try {
      url = this._createRedirectUrl();
    } catch (err: any) {
      this._error = "url_error";
      return;
    }

    if (this._redirect.navigate_outside_spa) {
      location.assign(url);
    } else {
      navigate(url, { replace: true });
    }
  }

  protected render() {
    if (this._error) {
      let error: string;
      switch (this._error) {
        case "not_supported":
          error =
            this.hass.localize(
              "ui.panel.my.not_supported",
              "link",
              html`<a
                target="_blank"
                rel="noreferrer noopener"
                href="https://my.home-assistant.io/faq.html#supported-pages"
                >${this.hass.localize("ui.panel.my.faq_link")}</a
              >`
            ) || "This redirect is not supported.";
          break;
        case "no_component":
          error =
            this.hass.localize(
              "ui.panel.my.component_not_loaded",
              "integration",
              html`<a
                target="_blank"
                rel="noreferrer noopener"
                href=${documentationUrl(
                  this.hass,
                  `/integrations/${this._redirect!.component!}`
                )}
                >${domainToName(
                  this.hass.localize,
                  this._redirect!.component!
                )}</a
              >`
            ) || "This redirect is not supported.";
          break;
        case "no_supervisor":
          error = this.hass.localize(
            "ui.panel.my.no_supervisor",
            "docs_link",
            html`<a
              target="_blank"
              rel="noreferrer noopener"
              href=${documentationUrl(this.hass, "/installation")}
              >${this.hass.localize("ui.panel.my.documentation")}</a
            >`
          );
          break;
        default:
          error = this.hass.localize("ui.panel.my.error") || "Unknown error";
      }
      return html`<hass-error-screen
        .error=${error}
        .hass=${this.hass}
      ></hass-error-screen>`;
    }
    return nothing;
  }

  private _createRedirectUrl(): string {
    const params = this._createRedirectParams();
    return `${this._redirect!.redirect}${params}`;
  }

  private _createRedirectParams(): string {
    const params = extractSearchParamsObject();
    if (!this._redirect!.params && !Object.keys(params).length) {
      return "";
    }
    const resultParams = {};
    for (const [key, type] of Object.entries(this._redirect!.params || {})) {
      if (!params[key] && type.endsWith("?")) {
        continue;
      }
      if (!params[key] || !this._checkParamType(type, params[key])) {
        throw Error();
      }
      resultParams[key] = params[key];
    }
    return `?${createSearchParam(resultParams)}`;
  }

  private _checkParamType(type: ParamType, value: string) {
    if (type === "string" || type === "string?") {
      return true;
    }
    if (type === "url") {
      return value && value === sanitizeUrl(value);
    }
    return false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-panel-my": HaPanelMy;
  }
}
