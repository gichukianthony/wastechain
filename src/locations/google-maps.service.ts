import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface GoogleMapsLocation {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    formatted_address: string;
}

export interface GoogleMapsPlace {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    types: string[];
}

@Injectable()
export class GoogleMapsService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://maps.googleapis.com/maps/api';

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
        if (!this.apiKey) {
            throw new Error('GOOGLE_MAPS_API_KEY is required');
        }
    }

    /**
     * Get live location from GPS coordinates
     */
    async getLiveLocationFromCoordinates(
        latitude: number,
        longitude: number,
    ): Promise<GoogleMapsLocation> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/geocode/json`,
                {
                    params: {
                        latlng: `${latitude},${longitude}`,
                        key: this.apiKey,
                    },
                },
            );

            if (response.data.status !== 'OK') {
                throw new HttpException(
                    `Google Maps API error: ${response.data.status}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const result = response.data.results[0];
            return this.parseGeocodingResult(result);
        } catch (error) {
            throw new HttpException(
                `Failed to get live location: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Get coordinates from address (Geocoding)
     */
    async getCoordinatesFromAddress(address: string): Promise<GoogleMapsLocation> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/geocode/json`,
                {
                    params: {
                        address: address,
                        key: this.apiKey,
                    },
                },
            );

            if (response.data.status !== 'OK') {
                throw new HttpException(
                    `Google Maps API error: ${response.data.status}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const result = response.data.results[0];
            return this.parseGeocodingResult(result);
        } catch (error) {
            throw new HttpException(
                `Failed to get coordinates: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Search for places using Google Places API
     */
    async searchPlaces(
        query: string,
        location?: { lat: number; lng: number },
        radius?: number,
    ): Promise<GoogleMapsPlace[]> {
        try {
            const params: any = {
                query: query,
                key: this.apiKey,
            };

            if (location && radius) {
                params.location = `${location.lat},${location.lng}`;
                params.radius = radius;
            }

            const response = await axios.get(
                `${this.baseUrl}/place/textsearch/json`,
                { params },
            );

            if (response.data.status !== 'OK') {
                throw new HttpException(
                    `Google Places API error: ${response.data.status}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return response.data.results.map((place: any) => ({
                place_id: place.place_id,
                name: place.name,
                formatted_address: place.formatted_address,
                geometry: place.geometry,
                types: place.types,
            }));
        } catch (error) {
            throw new HttpException(
                `Failed to search places: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Get place details by place_id
     */
    async getPlaceDetails(placeId: string): Promise<GoogleMapsPlace> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/place/details/json`,
                {
                    params: {
                        place_id: placeId,
                        fields: 'place_id,name,formatted_address,geometry,types',
                        key: this.apiKey,
                    },
                },
            );

            if (response.data.status !== 'OK') {
                throw new HttpException(
                    `Google Places API error: ${response.data.status}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const result = response.data.result;
            return {
                place_id: result.place_id,
                name: result.name,
                formatted_address: result.formatted_address,
                geometry: result.geometry,
                types: result.types,
            };
        } catch (error) {
            throw new HttpException(
                `Failed to get place details: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Get current location using browser geolocation (for frontend)
     */
    async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
        // This would typically be called from the frontend using browser geolocation
        // For backend, we can't directly access user's location
        throw new HttpException(
            'Current location must be obtained from frontend using browser geolocation API',
            HttpStatus.BAD_REQUEST,
        );
    }

    /**
     * Calculate distance between two points using Google Maps Distance Matrix API
     */
    async calculateDistanceAndDuration(
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number },
    ): Promise<{
        distance: { text: string; value: number };
        duration: { text: string; value: number };
    }> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/distancematrix/json`,
                {
                    params: {
                        origins: `${origin.lat},${origin.lng}`,
                        destinations: `${destination.lat},${destination.lng}`,
                        units: 'metric',
                        key: this.apiKey,
                    },
                },
            );

            if (response.data.status !== 'OK') {
                throw new HttpException(
                    `Google Distance Matrix API error: ${response.data.status}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const element = response.data.rows[0].elements[0];
            return {
                distance: element.distance,
                duration: element.duration,
            };
        } catch (error) {
            throw new HttpException(
                `Failed to calculate distance: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Parse Google Maps geocoding result
     */
    private parseGeocodingResult(result: any): GoogleMapsLocation {
        const location = result.geometry.location;
        const addressComponents = result.address_components;

        let city = '';
        let state = '';
        let country = '';
        let postal_code = '';

        addressComponents.forEach((component: any) => {
            const types = component.types;
            if (types.includes('locality')) city = component.long_name;
            if (types.includes('administrative_area_level_1')) state = component.long_name;
            if (types.includes('country')) country = component.long_name;
            if (types.includes('postal_code')) postal_code = component.long_name;
        });

        return {
            lat: location.lat,
            lng: location.lng,
            address: result.formatted_address,
            city,
            state,
            country,
            postal_code,
            formatted_address: result.formatted_address,
        };
    }
}
