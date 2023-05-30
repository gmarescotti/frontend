#!/bin/sh

docker cp hass_frontend/frontend_latest/app.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/app.js.map homeassistant:/config/www
docker cp hass_frontend/static/translations/en-1641709d26e071cca9a0d4b83255f64e.json homeassistant:/config/www
docker cp hass_frontend/static/translations/config/en-1641709d26e071cca9a0d4b83255f64e.json homeassistant:/config/www/custom/en-1641709d26e071cca9a0d4b83255f64e.json

docker cp hass_frontend/frontend_latest/src_components_data-table_sort_filter_worker_ts-_add90.chunk.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/vendors-node_modules_lit-labs_virtualizer_layouts_flow_js.chunk.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/src_panels_config_automation_automation-mode-dialog_dialog-automation-mode_ts.chunk.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/src_components_ha-form_ha-form-positive_time_period_dict_ts.chunk.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/vendors-node_modules_material_mwc-dialog_mwc-dialog-base_js-node_modules_material_mwc-dialog_-be868e.chunk.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/src_managers_notification-manager_ts.chunk.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/vendors-node_modules_polymer_paper-toast_paper-toast_js.chunk.js homeassistant:/config/www
docker cp hass_frontend/frontend_latest/vendors-node_modules_polymer_paper-toast_paper-toast_js.chunk.js.map homeassistant:/config/www
docker cp hass_frontend/frontend_latest/src_panels_config_automation_automation-mode-dialog_dialog-automation-mode_ts.chunk.js.map homeassistant:/config/www
