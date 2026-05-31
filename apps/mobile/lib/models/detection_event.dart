import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum AnimalClass {
  cow,
  buffalo,
  dog,
  goat,
  sheep,
  horse,
  human,
  cat,
}

enum RiskLevel {
  low,
  medium,
  high,
  critical,
}

enum ISAState {
  normal,
  compliant,
  advisory,
  breach,
  critical,
}

extension AnimalClassExt on AnimalClass {

  String get label {

    switch (this) {

      case AnimalClass.cow:
        return 'Cow';

      case AnimalClass.buffalo:
        return 'Buffalo';

      case AnimalClass.dog:
        return 'Dog';

      case AnimalClass.goat:
        return 'Goat';

      case AnimalClass.sheep:
        return 'Sheep';

      case AnimalClass.horse:
        return 'Horse';

      case AnimalClass.human:
        return 'Human';

      case AnimalClass.cat:
        return 'Cat';
    }
  }

  String get emoji {

    switch (this) {

      case AnimalClass.cow:
        return '🐄';

      case AnimalClass.buffalo:
        return '🐃';

      case AnimalClass.dog:
        return '🐕';

      case AnimalClass.goat:
        return '🐐';

      case AnimalClass.sheep:
        return '🐑';

      case AnimalClass.horse:
        return '🐎';

      case AnimalClass.human:
        return '🚶';

      case AnimalClass.cat:
        return '🐈';
    }
  }

  IconData get icon {

    switch (this) {

      case AnimalClass.cow:
      case AnimalClass.buffalo:
      case AnimalClass.dog:
      case AnimalClass.cat:
      case AnimalClass.goat:
      case AnimalClass.sheep:
        return Icons.pets;

      case AnimalClass.horse:
        return Icons.sports_motorsports;

      case AnimalClass.human:
        return Icons.person;
    }
  }

  // SPEED ALERT
  int get recommendedSpeed {

    switch (this) {

      case AnimalClass.human:
        return 30;

      case AnimalClass.cow:
      case AnimalClass.buffalo:
      case AnimalClass.horse:
        return 40;

      case AnimalClass.dog:
      case AnimalClass.cat:
      case AnimalClass.goat:
      case AnimalClass.sheep:
        return 45;
    }
  }

  // DETECTION COLOR
  Color get alertColor {

    switch (this) {

      case AnimalClass.human:
        return Colors.redAccent;

      case AnimalClass.cow:
      case AnimalClass.buffalo:
      case AnimalClass.horse:
        return Colors.orangeAccent;

      case AnimalClass.dog:
      case AnimalClass.cat:
      case AnimalClass.goat:
      case AnimalClass.sheep:
        return Colors.yellowAccent;
    }
  }
}

extension RiskLevelExt on RiskLevel {

  String get label {

    switch (this) {

      case RiskLevel.low:
        return 'LOW';

      case RiskLevel.medium:
        return 'MEDIUM';

      case RiskLevel.high:
        return 'HIGH';

      case RiskLevel.critical:
        return 'CRITICAL';
    }
  }

  Color get color {

    switch (this) {

      case RiskLevel.low:
        return AppColors.riskLow;

      case RiskLevel.medium:
        return AppColors.riskMedium;

      case RiskLevel.high:
        return AppColors.riskHigh;

      case RiskLevel.critical:
        return AppColors.riskCritical;
    }
  }

  Color get glowColor {

    switch (this) {

      case RiskLevel.low:
        return const Color(0x3000BFA5);

      case RiskLevel.medium:
        return const Color(0x30FFD600);

      case RiskLevel.high:
        return const Color(0x30FF6D00);

      case RiskLevel.critical:
        return const Color(0x30FF1744);
    }
  }
}

class DetectionEvent {

  final String id;

  final AnimalClass animalClass;

  final double confidence;

  final double lat;
  final double lon;

  final DateTime detectedAt;

  final double speedKmph;

  final bool uploaded;

  const DetectionEvent({

    required this.id,

    required this.animalClass,

    required this.confidence,

    required this.lat,
    required this.lon,

    required this.detectedAt,

    required this.speedKmph,

    this.uploaded = true,
  });
}

class DangerZone {

  final String id;

  final String zoneCode;

  final String label;

  final RiskLevel riskLevel;

  final double riskScore;

  final int recommendedSpeedKmph;

  final AnimalClass dominantAnimal;

  final String activeTimeStart;
  final String activeTimeEnd;

  final int detectionCount30d;

  final double centerLat;
  final double centerLon;

  const DangerZone({

    required this.id,

    required this.zoneCode,

    required this.label,

    required this.riskLevel,

    required this.riskScore,

    required this.recommendedSpeedKmph,

    required this.dominantAnimal,

    required this.activeTimeStart,
    required this.activeTimeEnd,

    required this.detectionCount30d,

    required this.centerLat,
    required this.centerLon,
  });
}

class DriveSession {

  final String id;

  final DateTime startTime;
  final DateTime endTime;

  final double distanceKm;

  final int detectionCount;

  final int zonesEntered;

  final String routeLabel;

  final int maxSpeedKmph;

  const DriveSession({

    required this.id,

    required this.startTime,
    required this.endTime,

    required this.distanceKm,

    required this.detectionCount,

    required this.zonesEntered,

    required this.routeLabel,

    required this.maxSpeedKmph,
  });

  Duration get duration =>
      endTime.difference(startTime);
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

class MockData {

  static final List<DetectionEvent>
  recentDetections = [

    DetectionEvent(

      id: 'd1',

      animalClass: AnimalClass.cow,

      confidence: 0.91,

      lat: 28.6139,
      lon: 77.2090,

      detectedAt:
      DateTime.now().subtract(
        const Duration(seconds: 22),
      ),

      speedKmph: 52,
    ),

    DetectionEvent(

      id: 'd2',

      animalClass: AnimalClass.human,

      confidence: 0.96,

      lat: 28.6145,
      lon: 77.2102,

      detectedAt:
      DateTime.now().subtract(
        const Duration(minutes: 1),
      ),

      speedKmph: 28,
    ),

    DetectionEvent(

      id: 'd3',

      animalClass: AnimalClass.dog,

      confidence: 0.81,

      lat: 28.6210,
      lon: 77.2175,

      detectedAt:
      DateTime.now().subtract(
        const Duration(minutes: 4),
      ),

      speedKmph: 42,
    ),

    DetectionEvent(

      id: 'd4',

      animalClass: AnimalClass.buffalo,

      confidence: 0.93,

      lat: 28.6225,
      lon: 77.2190,

      detectedAt:
      DateTime.now().subtract(
        const Duration(minutes: 9),
      ),

      speedKmph: 68,
    ),

    DetectionEvent(

      id: 'd5',

      animalClass: AnimalClass.cat,

      confidence: 0.74,

      lat: 28.6182,
      lon: 77.2145,

      detectedAt:
      DateTime.now().subtract(
        const Duration(minutes: 14),
      ),

      speedKmph: 30,
    ),
  ];

  static final List<DangerZone>
  dangerZones = [

    DangerZone(

      id: 'z1',

      zoneCode: 'DZ-NH48-007',

      label: 'NH48 km 215–217',

      riskLevel: RiskLevel.critical,

      riskScore: 0.87,

      recommendedSpeedKmph: 40,

      dominantAnimal: AnimalClass.cow,

      activeTimeStart: '18:00',

      activeTimeEnd: '22:00',

      detectionCount30d: 142,

      centerLat: 28.6200,

      centerLon: 77.2150,
    ),

    DangerZone(

      id: 'z2',

      zoneCode: 'DZ-NH44-023',

      label: 'NH44 km 88–90',

      riskLevel: RiskLevel.high,

      riskScore: 0.63,

      recommendedSpeedKmph: 30,

      dominantAnimal: AnimalClass.human,

      activeTimeStart: '05:00',

      activeTimeEnd: '08:00',

      detectionCount30d: 87,

      centerLat: 28.6350,

      centerLon: 77.2280,
    ),
  ];

  static final List<DriveSession>
  driveSessions = [

    DriveSession(

      id: 's1',

      startTime:
      DateTime.now().subtract(
        const Duration(
          hours: 1,
          minutes: 12,
        ),
      ),

      endTime:
      DateTime.now().subtract(
        const Duration(minutes: 8),
      ),

      distanceKm: 34.2,

      detectionCount: 5,

      zonesEntered: 2,

      routeLabel:
      'NH48 · Gurugram → Delhi',

      maxSpeedKmph: 82,
    ),

    DriveSession(

      id: 's2',

      startTime:
      DateTime.now().subtract(
        const Duration(
          days: 1,
          hours: 2,
        ),
      ),

      endTime:
      DateTime.now().subtract(
        const Duration(
          days: 1,
          minutes: 15,
        ),
      ),

      distanceKm: 21.7,

      detectionCount: 2,

      zonesEntered: 1,

      routeLabel:
      'SH32 · Morning Commute',

      maxSpeedKmph: 65,
    ),
  ];
}