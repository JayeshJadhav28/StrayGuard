import 'dart:convert';
import 'package:http/http.dart' as http;

class BackendService {
  // Change this to your PC IP when testing on mobile
  static const String baseUrl = "http://192.168.153.225:4747";

  // ----------------------------------
  // LIVE DETECTION
  // ----------------------------------
  static Future<Map<String, dynamic>> getLive() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/live"));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        return {
          "online": true,
          "objects": data["objects"] ?? [],
          "collision": data["collision"] ?? false,
          "gps": data["gps"],
        };
      }
    } catch (e) {
      print("LIVE ERROR: $e");
    }

    return {"online": false, "objects": [], "collision": false, "gps": null};
  }

  // ----------------------------------
  // GPS
  // ----------------------------------
  static Future<Map<String, dynamic>> getGps() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/gps"));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("GPS ERROR: $e");
    }

    return {"lat": null, "lon": null, "timestamp": null};
  }

  // ----------------------------------
  // ALL WILDLIFE ZONES
  // ----------------------------------
  static Future<Map<String, dynamic>> getZones() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/zones"));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("ZONES ERROR: $e");
    }

    return {"type": "FeatureCollection", "features": []};
  }

  // ----------------------------------
  // LIVE LOCATION RISK
  // ----------------------------------
  static Future<Map<String, dynamic>> getLiveRisk(
    double lat,
    double lon,
  ) async {
    try {
      final response = await http.get(
        Uri.parse("$baseUrl/dashboard/live-risk?lat=$lat&lon=$lon"),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("LIVE RISK ERROR: $e");
    }

    return {
      "risk_level": "LOW",
      "recommended_speed": 80,
      "animals": [],
      "nearby_zones": [],
    };
  }

  // ----------------------------------
  // ROUTE RISK
  // ----------------------------------
  static Future<Map<String, dynamic>> getRouteRisk(
    List<List<double>> route,
  ) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/dashboard/route-risk"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"route": route}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print("ROUTE RISK ERROR: $e");
    }

    return {
      "risk_level": "LOW",
      "crossed_zones": [],
      "total_zones": 0,
      "recommended_speed": 80,
      "animals": [],
    };
  }

  // ----------------------------------
  // VIDEO STREAM
  // ----------------------------------
  static String getVideoUrl() {
    return "$baseUrl/video";
  }

  // ----------------------------------
  // VIDEO UI
  // ----------------------------------
  static String getVideoUiUrl() {
    return "$baseUrl/video-ui";
  }
}
