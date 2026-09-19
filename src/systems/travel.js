/**
 * TextScape Travel System
 * 
 * Handles player movement through the world graph.
 * Validates exits and updates player state.
 */

const TravelSystem = (() => {
  /**
   * Attempt to travel from current location to a new destination
   * @param {object} state - Game state
   * @param {string} directionOrTarget - Direction or destination name/ID
   * @returns {object} Result { success, messages, newLocation }
   */
  function travel(state, directionOrTarget) {
    const currentLocationId = state.player.currentLocation;
    const currentLocation = getLocation(currentLocationId);

    if (!currentLocation) {
      return {
        success: false,
        messages: ['Your current location is invalid. Returning to Moonwatch Town.'],
        newLocation: 'moonwatch_town'
      };
    }

    // Resolve where the player wants to go
    const resolution = resolveTravel(currentLocationId, directionOrTarget);

    if (!resolution.success) {
      return {
        success: false,
        messages: [resolution.reason || 'You cannot travel in that direction.'],
        newLocation: currentLocationId
      };
    }

    const destinationId = resolution.destination;
    const destination = getLocation(destinationId);

    if (!destination) {
      return {
        success: false,
        messages: ['That destination does not exist.'],
        newLocation: currentLocationId
      };
    }

    // Successful travel
    return {
      success: true,
      messages: [`You travel to ${destination.name}.`],
      newLocation: destinationId
    };
  }

  /**
   * Get contextual travel options from current location
   * @param {string} locationId - Current location ID
   * @returns {array} Array of { direction, destinationId, destinationName }
   */
  function getAvailableTravelOptions(locationId) {
    const location = getLocation(locationId);
    if (!location || !location.exits) return [];

    const options = [];
    Object.entries(location.exits).forEach(([direction, destId]) => {
      const dest = getLocation(destId);
      if (dest) {
        options.push({
          direction,
          destinationId: destId,
          destinationName: dest.name
        });
      }
    });

    return options;
  }

  return {
    travel,
    getAvailableTravelOptions
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TravelSystem;
}

// Expose globally
if (typeof window !== 'undefined') {
  window.TravelSystem = TravelSystem;
}
