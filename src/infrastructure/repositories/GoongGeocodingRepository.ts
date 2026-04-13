import { ApiError, AppError, NetworkError, QuotaExceededError } from "../../core/errors/AppErrors";
import { IGeocodingRepository } from "../../domain/repositories/GeocodingRepository";
import { IAddressSuggestion, ILocationCoordinate } from "../../domain/shared/types";
import { GOONG_CONFIG } from "../api/goong/GoongConfig";

export class GoongGeocodingRepository implements IGeocodingRepository {
  private readonly VN_LOCATION = "16.047079,108.206230";
  private readonly VN_RADIUS = "1000";

  async searchAddress(query: string, sessionToken: string): Promise<IAddressSuggestion[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const params = new URLSearchParams({
        api_key: GOONG_CONFIG.API_KEY,
        input: query,
        sessiontoken: sessionToken,
        location: this.VN_LOCATION,
        radius: this.VN_RADIUS,
        limit: "10",
        more_compound: "true",
      });

      const url = `${GOONG_CONFIG.BASE_URL}${GOONG_CONFIG.AUTOCOMPLETE_ENDPOINT}?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new NetworkError();
      }

      const data = await response.json();

      if (data.status === "OVER_QUERY_LIMIT" || data.status === "REQUEST_DENIED") {
        throw new QuotaExceededError();
      }

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        return [];
      }

      return (data.predictions || []).map((item: { place_id: string; description: string; structured_formatting: { main_text: string; secondary_text: string } }) => ({
        place_id: item.place_id,
        description: item.description,
        structured_formatting: {
          main_text: item.structured_formatting.main_text,
          secondary_text: item.structured_formatting.secondary_text,
        },
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new NetworkError();
    }
  }

  async reverseGeocode(coordinate: ILocationCoordinate): Promise<string> {
    try {
      const url = `${GOONG_CONFIG.BASE_URL}/Geocode?latlng=${coordinate.latitude},${coordinate.longitude}&api_key=${GOONG_CONFIG.API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        const statusText = response.statusText || "Unknown error";
        throw new ApiError(`Không thể kết nối tới dịch vụ bản đồ (HTTP ${response.status}: ${statusText})`);
      }

      const data = await response.json();

      if (data.status === "OVER_QUERY_LIMIT") {
        throw new QuotaExceededError();
      }

      if (data.status === "REQUEST_DENIED") {
        throw new ApiError("Không có quyền truy cập dịch vụ bản đồ. Vui lòng kiểm tra API key.");
      }

      if (data.status === "ZERO_RESULTS") {
        throw new ApiError("Không tìm thấy địa chỉ tại vị trí này");
      }

      if (data.status !== "OK") {
        const errorMsg = data.error_message || data.status || "Unknown error";
        throw new ApiError(`Lỗi xác định vị trí: ${errorMsg}`);
      }

      const address = data.results[0]?.formatted_address;

      if (!address) {
        throw new ApiError("Không có dữ liệu địa chỉ trả về");
      }

      return address;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }

      const errMsg = error instanceof Error ? error.message : '';
      const errName = error instanceof Error ? error.name : '';

      if (errName === "TypeError" || errMsg.includes("Network") || errMsg.includes("network")) {
        throw new NetworkError();
      }

      if (errMsg.includes("timeout")) {
        throw new NetworkError();
      }

      throw new ApiError("Không thể xác định địa chỉ. Vui lòng thử lại sau.");
    }
  }

  async getPlaceDetail(placeId: string, sessionToken: string): Promise<ILocationCoordinate> {
    try {
      if (!placeId) throw new ApiError("Place ID is required");

      const params = new URLSearchParams({
        api_key: GOONG_CONFIG.API_KEY,
        place_id: placeId,
        sessiontoken: sessionToken,
      });

      const url = `${GOONG_CONFIG.BASE_URL}/Place/Detail?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) throw new NetworkError();

      const data = await response.json();

      if (data.status !== "OK") {
        throw new ApiError(data.error_message || "Không thể lấy chi tiết địa điểm");
      }

      const { lat, lng } = data.result.geometry.location;

      return { latitude: lat, longitude: lng };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new NetworkError();
    }
  }
}
