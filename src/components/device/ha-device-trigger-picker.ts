import { customElement } from "lit/decorators";
import {
  DeviceTrigger,
  fetchDeviceTriggers,
  localizeDeviceAutomationTrigger,
} from "../../data/device_automation";
import { HaDeviceAutomationPicker } from "./ha-device-automation-picker";
import { myhass } from "../../panels/config/automation/my-hass";

@customElement("ha-device-trigger-picker")
class HaDeviceTriggerPicker extends HaDeviceAutomationPicker<DeviceTrigger> {
  protected get NO_AUTOMATION_TEXT() {
    return myhass.localize(
      "ui.panel.config.devices.automation.triggers.no_triggers"
    );
  }

  protected get UNKNOWN_AUTOMATION_TEXT() {
    return myhass.localize(
      "ui.panel.config.devices.automation.triggers.unknown_trigger"
    );
  }

  constructor() {
    super(
      localizeDeviceAutomationTrigger,
      fetchDeviceTriggers,
      (deviceId?: string) => ({
        device_id: deviceId || "",
        platform: "device",
        domain: "",
        entity_id: "",
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-device-trigger-picker": HaDeviceTriggerPicker;
  }
}
