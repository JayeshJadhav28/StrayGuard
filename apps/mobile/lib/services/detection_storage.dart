import 'package:latlong2/latlong.dart';

class DetectionRecord {

  final String animal;

  final String emoji;

  String location;

  double latitude;

  double longitude;

  DateTime time;

  int count;

  DetectionRecord({

    required this.animal,

    required this.emoji,

    required this.location,

    required this.latitude,

    required this.longitude,

    required this.time,

    this.count = 1,
  });
}

class DangerZone {

  final String location;

  double latitude;

  double longitude;

  int totalDetections;

  DangerZone({

    required this.location,

    required this.latitude,

    required this.longitude,

    this.totalDetections = 0,
  });

  LatLng get center =>
      LatLng(latitude, longitude);
}

class DetectionStorage {

  // =========================================================
  // HISTORY
  // =========================================================

  static final List<DetectionRecord>
  history = [];

  // =========================================================
  // ZONES
  // =========================================================

  static final List<DangerZone>
  zones = [];

  // =========================================================
  // ADD DETECTION
  // =========================================================

  static bool addDetection({

    required String animal,

    required String emoji,

    required String location,

    required double latitude,

    required double longitude,
  }) {

    // =====================================================
    // SKIP UNKNOWN
    // =====================================================

    if (animal
        .toLowerCase()
        .contains("unknown")) {

      return false;
    }

    // =====================================================
    // HISTORY UPDATE
    // =====================================================

    final existing = history.where(

          (e) =>

      e.animal.toLowerCase() ==
          animal.toLowerCase() &&

          _distanceKm(
            e.latitude,
            e.longitude,
            latitude,
            longitude,
          ) < 1.0,
    ).toList();

    if (existing.isNotEmpty) {

      final item = existing.first;

      item.count += 1;

      item.location = location;

      item.latitude = latitude;

      item.longitude = longitude;

      item.time = DateTime.now();

      history.remove(item);

      history.insert(0, item);

    } else {

      history.insert(

        0,

        DetectionRecord(

          animal: animal,

          emoji: emoji,

          location: location,

          latitude: latitude,

          longitude: longitude,

          time: DateTime.now(),

          count: 1,
        ),
      );
    }

    // =====================================================
    // ZONE UPDATE
    // =====================================================

    final zoneExisting = zones.where(

          (z) =>

      _distanceKm(
        z.latitude,
        z.longitude,
        latitude,
        longitude,
      ) < 1.0,
    ).toList();

    if (zoneExisting.isNotEmpty) {

      final zone =
          zoneExisting.first;

      zone.totalDetections += 1;

      // update averaged center

      zone.latitude =
          (zone.latitude + latitude) / 2;

      zone.longitude =
          (zone.longitude + longitude) / 2;

      if (zone.totalDetections == 20) {

        return true;
      }

    } else {

      zones.add(

        DangerZone(

          location: location,

          latitude: latitude,

          longitude: longitude,

          totalDetections: 1,
        ),
      );
    }

    return false;
  }

  // =========================================================
  // HIGH RISK ZONES
  // =========================================================

  static List<DangerZone>
  get highRiskZones {

    return zones.where(

          (z) =>

      z.totalDetections >= 20,

    ).toList();
  }

  // =========================================================
  // DISTANCE CALC
  // =========================================================

  static double _distanceKm(

      double lat1,
      double lon1,
      double lat2,
      double lon2,
      ) {

    const Distance distance =
    Distance();

    return distance.as(

      LengthUnit.Kilometer,

      LatLng(lat1, lon1),

      LatLng(lat2, lon2),
    );
  }
}