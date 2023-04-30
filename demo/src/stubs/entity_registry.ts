import { EntityRegistryEntry } from "../../../src/data/entity_registry";
import type { MockHomeAssistant } from "../../../src/fake_data/provide_hass";

export const mockEntityRegistry = (
  hass: MockHomeAssistant,
  data: EntityRegistryEntry[] = []
) => {
  hass.mockWS("my-giulio/entity_registry/list", () => data);
};
