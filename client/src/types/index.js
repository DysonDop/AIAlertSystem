/**
 * Type definitions for AI Alert System using JSDoc
 * These provide type information for better development experience
 */

/**
 * @typedef {'earthquake' | 'flood' | 'fire' | 'storm' | 'tsunami' | 'hurricane' | 'tornado'} AlertType
 */

/**
 * @typedef {'low' | 'medium' | 'high' | 'critical'} AlertSeverity
 */

/**
 * @typedef {'twitter' | 'meteorological' | 'manual'} AlertSource
 */

/**
 * @typedef {Object} AlertLocation
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {string} address - Human readable address
 * @property {number} radius - Radius in kilometers
 */

/**
 * @typedef {Object} Alert
 * @property {string} id - Unique identifier
 * @property {AlertType} type - Type of disaster
 * @property {AlertSeverity} severity - Severity level
 * @property {string} title - Alert title
 * @property {string} description - Detailed description
 * @property {AlertLocation} location - Location information
 * @property {string} timestamp - ISO timestamp
 * @property {AlertSource} source - Source of the alert
 * @property {boolean} isActive - Whether the alert is currently active
 * @property {string[]} [affectedAreas] - Optional affected areas
 * @property {string[]} [recommendations] - Optional recommendations
 */

/**
 * @typedef {Object} RouteStep
 * @property {string} instruction - Turn-by-turn instruction
 * @property {Object} distance - Distance information
 * @property {string} distance.text - Human readable distance
 * @property {number} distance.value - Distance in meters
 * @property {Object} duration - Duration information
 * @property {string} duration.text - Human readable duration
 * @property {number} duration.value - Duration in seconds
 * @property {string} polyline - Encoded polyline for the step
 */

/**
 * @typedef {Object} Route
 * @property {string} id - Unique route identifier
 * @property {Array<{lat: number, lng: number}>} waypoints - Route waypoints
 * @property {number} distance - Distance in meters
 * @property {number} duration - Duration in seconds
 * @property {string} summary - Route summary
 * @property {string} encodedPolyline - Encoded polyline for entire route
 * @property {string} distanceText - Human readable distance
 * @property {string} durationText - Human readable duration
 * @property {RouteStep[]} [steps] - Optional turn-by-turn steps
 * @property {Alert[]} [alertsOnRoute] - Optional alerts along the route
 * @property {boolean} [isRecommended] - Whether this route is recommended
 */

/**
 * @typedef {Object} TwitterData
 * @property {string} id - Tweet ID
 * @property {string} text - Tweet content
 * @property {string} author - Tweet author
 * @property {string} timestamp - Tweet timestamp
 * @property {Object} [location] - Optional location
 * @property {number} location.lat - Latitude
 * @property {number} location.lng - Longitude
 * @property {string[]} keywords - Extracted keywords
 * @property {'positive' | 'negative' | 'neutral'} sentiment - Sentiment analysis
 * @property {number} relevanceScore - Relevance score (0-1)
 */

/**
 * @typedef {Object} WeatherAlert
 * @property {string} type - Weather alert type
 * @property {string} severity - Alert severity
 * @property {string} description - Alert description
 * @property {string} startTime - Start time
 * @property {string} endTime - End time
 */

/**
 * @typedef {Object} CurrentWeather
 * @property {number} temperature - Temperature in celsius
 * @property {number} humidity - Humidity percentage
 * @property {number} windSpeed - Wind speed in km/h
 * @property {number} windDirection - Wind direction in degrees
 * @property {number} precipitation - Precipitation in mm
 * @property {number} visibility - Visibility in km
 */

/**
 * @typedef {Object} WeatherData
 * @property {Object} location - Location information
 * @property {number} location.lat - Latitude
 * @property {number} location.lng - Longitude
 * @property {string} location.name - Location name
 * @property {CurrentWeather} current - Current weather conditions
 * @property {WeatherAlert[]} alerts - Weather alerts
 */

/**
 * @typedef {Object} SearchFilters
 * @property {AlertType[]} alertTypes - Alert types to filter by
 * @property {AlertSeverity[]} severity - Severity levels to filter by
 * @property {Object} [location] - Optional location filter
 * @property {number} location.lat - Latitude
 * @property {number} location.lng - Longitude
 * @property {number} location.radius - Search radius in km
 * @property {Object} [dateRange] - Optional date range filter
 * @property {string} dateRange.start - Start date (ISO string)
 * @property {string} dateRange.end - End date (ISO string)
 * @property {AlertSource[]} source - Sources to filter by
 */

// Export empty object to make this a module
export {};