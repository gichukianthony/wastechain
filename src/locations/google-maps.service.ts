import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface LocationIQLocation {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  formatted_address: string;
}

@Injectable()
export class LocationIQService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://us1.locationiq.com/v1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('LOCATIONIQ_API_KEY')!;
    if (!this.apiKey) {
      throw new Error('LOCATIONIQ_API_KEY is required');
    }
  }

  /**
   * Reverse Geocoding: Coordinates → Address
   */
  async getLiveLocationFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<LocationIQLocation> {
    try {
      const response = await axios.get(`${this.baseUrl}/reverse.php`, {
        params: {
          key: this.apiKey,
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1,
        },
      });

      const data = response.data;

      return {
        lat: Number(data.lat),
        lng: Number(data.lon),
        address: data.display_name,
        city: data.address.city || data.address.town,
        state: data.address.state,
        country: data.address.country,
        postal_code: data.address.postcode,
        formatted_address: data.display_name,
      };
    } catch (error) {
      throw new HttpException(
        `LocationIQ reverse geocoding failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Geocoding: Address → Coordinates
   */
  async getCoordinatesFromAddress(
    address: string,
  ): Promise<LocationIQLocation> {
    try {
      const response = await axios.get(`${this.baseUrl}/search.php`, {
        params: {
          key: this.apiKey,
          q: address,
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
      });

      const result = response.data[0];

      return {
        lat: Number(result.lat),
        lng: Number(result.lon),
        address: result.display_name,
        city: result.address.city || result.address.town,
        state: result.address.state,
        country: result.address.country,
        postal_code: result.address.postcode,
        formatted_address: result.display_name,
      };
    } catch (error) {
      throw new HttpException(
        `LocationIQ geocoding failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Place Search (similar to Google Places)
   */
  async searchPlaces(query: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/autocomplete.php`, {
        params: {
          key: this.apiKey,
          q: query,
        },
      });

      return response.data.map((place: any) => ({
        place_id: place.place_id,
        name: place.display_name,
        lat: place.lat,
        lng: place.lon,
        type: place.type,
      }));
    } catch (error) {
      throw new HttpException(
        `LocationIQ place search failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Distance Matrix (Driving distance + duration)
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
        `https://us1.locationiq.com/v1/matrix/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
        {
          params: {
            key: this.apiKey,
          },
        },
      );

      const distances = response.data.distances[0][1]; // meters
      const durations = response.data.durations[0][1]; // seconds

      return {
        distance: {
          text: `${(distances / 1000).toFixed(2)} km`,
          value: distances,
        },
        duration: {
          text: `${Math.round(durations / 60)} mins`,
          value: durations,
        },
      };
    } catch (error) {
      throw new HttpException(
        `LocationIQ distance calculation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
