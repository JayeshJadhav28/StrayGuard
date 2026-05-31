import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://192.168.153.225:8000";

  // -------------------------------
  // LIVE CAMERA FEED
  // -------------------------------
  static Future<Map<String, dynamic>> getLive() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/live"));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("LIVE ERROR: $e");
    }

    return {"objects": [], "collision": false, "gps": null};
  }

  // -------------------------------
  // VIDEO STREAM
  // -------------------------------
  static String getVideoUrl() {
    return "$baseUrl/video";
  }

  // -------------------------------
  // GPS FETCH
  // -------------------------------
  static Future<Map<String, dynamic>> getGps() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/gps"));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("GPS ERROR: $e");
    }

    return {"lat": null, "lon": null};
  }

  // =====================================================
  // 🚀 NEW: REGION RISK API (ADDED - NO BREAKING CHANGE)
  // =====================================================
  static Future<Map<String, dynamic>> getRegionRisk(String region) async {
    try {
      final response = await http.get(
        Uri.parse("$baseUrl/dashboard/region-risk?region=$region"),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("REGION RISK ERROR: $e");
    }

    return {
      "risk_level": "LOW",
      "recommended_speed": 80,
      "nearby_zones": [],
      "animals": [],
    };
  }

  // =====================================================
  // 🚀 NEW: ZONES LIST API
  // =====================================================
  static Future<Map<String, dynamic>> getAllZones() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/zones"));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("ZONES ERROR: $e");
    }

    return {"features": []};
  }
}
