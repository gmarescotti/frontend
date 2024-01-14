// import {
//   setPassiveTouchGestures,
//   setCancelSyntheticClickEvents,
// } from "@polymer/polymer/lib/utils/settings";
// import "@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min";
// import "../layouts/home-assistant";
// import "../panels/config/automation/ha-automation-editor";

// import "../panels/config/automation/ha-config-automation";
// import "../resources/ha-style";
// import "../resources/roboto";

// import "../util/legacy-support";

// setPassiveTouchGestures(true);
// setCancelSyntheticClickEvents(false);


// Compat needs to be first import
import "../resources/compatibility";
import "@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min";
// import "../layouts/home-assistant";
import "../panels/config/automation/ha-config-automation";

import("../resources/ha-style");
import("@polymer/polymer/lib/utils/settings").then(
  ({ setCancelSyntheticClickEvents, setPassiveTouchGestures }) => {
    setCancelSyntheticClickEvents(false);
    setPassiveTouchGestures(true);
  }
);
