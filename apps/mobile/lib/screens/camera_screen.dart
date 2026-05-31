import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import '../services/backend_service.dart';
import '../services/detection_storage.dart';

import '../models/detection_event.dart';

import '../widgets/detection_bbox_overlay.dart';
import '../widgets/corner_brackets.dart';

import 'camera_widgets.dart';
import 'camera_painters.dart';
import 'web_camera_view.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() =>
      _CameraScreenState();
}

class _CameraScreenState
    extends State<CameraScreen>
    with TickerProviderStateMixin {

  // =========================================================
  // STATUS
  // =========================================================

  bool _backendOnline = false;

  bool _cameraActive = true;

  bool _isRecording = true;

  bool _animalDetected = false;

  bool _alertShown = false;

  int _detectionCount = 0;

  AnimalClass? _detectedClass;

  // =========================================================
  // GPS
  // =========================================================

  double? _latitude;

  double? _longitude;

  String _currentLocationName =
      "Current Location";

  // =========================================================
  // ANIMATIONS
  // =========================================================

  late AnimationController _recordDot;

  late AnimationController _animalPulse;

  late AnimationController _scanLine;

  // =========================================================
  // TIMER
  // =========================================================

  Timer? _pollTimer;

  Timer? _gpsTimer;

  // =========================================================
  // INIT
  // =========================================================

  @override
  void initState() {

    super.initState();

    _recordDot = AnimationController(

      vsync: this,

      duration:
      const Duration(milliseconds: 900),

    )..repeat(reverse: true);

    _animalPulse = AnimationController(

      vsync: this,

      duration:
      const Duration(milliseconds: 600),

    )..repeat(reverse: true);

    _scanLine = AnimationController(

      vsync: this,

      duration:
      const Duration(seconds: 3),

    )..repeat();

    _loadGps();

    _gpsTimer = Timer.periodic(

      const Duration(seconds: 8),

          (_) {

        _loadGps();
      },
    );

    _startPolling();
  }

  // =========================================================
  // GPS
  // =========================================================

  Future<void> _loadGps() async {

    try {

      final permission =
      await Geolocator.requestPermission();

      if (permission ==
          LocationPermission.denied ||
          permission ==
              LocationPermission.deniedForever) {
        return;
      }

      final position =
      await Geolocator.getCurrentPosition(

        desiredAccuracy:
        LocationAccuracy.best,
      );

      if (!mounted) return;

      setState(() {

        _latitude =
            position.latitude;

        _longitude =
            position.longitude;

        _currentLocationName =
        "${position.latitude.toStringAsFixed(4)}, "
            "${position.longitude.toStringAsFixed(4)}";
      });

    } catch (e) {

      print("GPS ERROR => $e");
    }
  }

  // =========================================================
  // POLLING
  // =========================================================

  void _startPolling() {

    _pollTimer?.cancel();

    _pollTimer = Timer.periodic(

      const Duration(milliseconds: 700),

          (_) => _fetchBackendData(),
    );

    _fetchBackendData();
  }

  // =========================================================
  // POPUP
  // =========================================================

  Future<void> _showAnimalPopup(
      AnimalClass detected,
      ) async {

    if (_alertShown) return;

    _alertShown = true;

    _pollTimer?.cancel();

    String recommendedSpeed = "40";

    switch (detected) {

      case AnimalClass.human:
        recommendedSpeed = "25";
        break;

      case AnimalClass.dog:
      case AnimalClass.cat:
        recommendedSpeed = "30";
        break;

      case AnimalClass.cow:
      case AnimalClass.buffalo:
      case AnimalClass.horse:
        recommendedSpeed = "20";
        break;

      case AnimalClass.goat:
      case AnimalClass.sheep:
        recommendedSpeed = "35";
        break;
    }

    if (!mounted) return;

    await showDialog(

      context: context,

      barrierDismissible: false,

      builder: (_) {

        return AlertDialog(

          backgroundColor: Colors.black,

          shape: RoundedRectangleBorder(
            borderRadius:
            BorderRadius.circular(20),
          ),

          title: const Text(

            "⚠ Front Obstacle Detected",

            style: TextStyle(

              color: Colors.red,

              fontWeight: FontWeight.bold,
            ),
          ),

          content: Column(

            mainAxisSize: MainAxisSize.min,

            crossAxisAlignment:
            CrossAxisAlignment.start,

            children: [

              Text(

                "${detected.emoji} "
                    "${detected.label} detected ahead",

                style: const TextStyle(

                  color: Colors.white,

                  fontSize: 18,

                  fontWeight:
                  FontWeight.bold,
                ),
              ),

              const SizedBox(height: 16),

              Text(

                "Recommended Speed:\n"
                    "$recommendedSpeed km/h",

                style: const TextStyle(

                  color: Colors.orange,

                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 16),

              Text(

                "Location:\n$_currentLocationName",

                style: const TextStyle(

                  color: Colors.white70,

                  fontSize: 14,
                ),
              ),
            ],
          ),

          actions: [

            TextButton(

              onPressed: () async {

                final becameDangerZone =

                DetectionStorage.addDetection(

                  animal:
                  detected.label,

                  emoji:
                  detected.emoji,

                  location:
                  _currentLocationName,

                  latitude:
                  _latitude ?? 0,

                  longitude:
                  _longitude ?? 0,
                );

                Navigator.pop(context);

                // =====================================
                // HIGH RISK ZONE CREATED
                // =====================================

                if (becameDangerZone &&
                    mounted) {

                  await Future.delayed(
                    const Duration(
                        milliseconds: 300),
                  );

                  if (!mounted) return;

                  await showDialog(

                    context: context,

                    barrierDismissible: false,

                    builder: (_) {

                      return AlertDialog(

                        backgroundColor:
                        Colors.red.shade900,

                        shape:
                        RoundedRectangleBorder(
                          borderRadius:
                          BorderRadius.circular(
                              20),
                        ),

                        title: const Text(

                          "🚨 High Risk Zone Created",

                          style: TextStyle(

                            color:
                            Colors.white,

                            fontWeight:
                            FontWeight.bold,
                          ),
                        ),

                        content: Text(

                          "${detected.emoji} "
                              "${detected.label} activity crossed\n"
                              "20+ detections.\n\n"
                              "This location is now marked as\n"
                              "HIGH RISK animal zone.",

                          style:
                          const TextStyle(

                            color:
                            Colors.white,

                            fontSize: 16,
                          ),
                        ),

                        actions: [

                          TextButton(

                            onPressed: () {

                              Navigator.pop(
                                  context);
                            },

                            child: const Text(

                              "OK",

                              style: TextStyle(
                                color:
                                Colors.white,
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  );
                }
              },

              child: const Text(

                "OK",

                style: TextStyle(
                  color: Colors.green,
                ),
              ),
            ),
          ],
        );
      },
    );

    await Future.delayed(
      const Duration(seconds: 1),
    );

    _alertShown = false;

    _startPolling();
  }

  // =========================================================
  // FETCH DATA
  // =========================================================

  Future<void> _fetchBackendData() async {

    try {

      final live =
      await BackendService.getLive();

      print("LIVE DATA => $live");

      if (!mounted) return;

      // =====================================================
      // OFFLINE
      // =====================================================

      final online =

          live["online"] == true ||

              live["status"] == "ok";

      if (live.isEmpty || !online) {

        setState(() {

          _backendOnline = false;

          _animalDetected = false;

          _detectedClass = null;

          _detectionCount = 0;
        });

        return;
      }

      // =====================================================
      // OBJECTS
      // =====================================================

      final List objects =
          live["objects"] ?? [];

      AnimalClass? detectedAnimal;

      int count = 0;

      final animalMap = {

        "person": AnimalClass.human,
        "human": AnimalClass.human,

        "dog": AnimalClass.dog,

        "cow": AnimalClass.cow,

        "goat": AnimalClass.goat,

        "sheep": AnimalClass.sheep,

        "horse": AnimalClass.horse,

        "buffalo": AnimalClass.buffalo,

        "cat": AnimalClass.cat,
      };

      // =====================================================
      // DETECTION
      // =====================================================

      for (final obj in objects) {

        final label =
        (obj["label"] ?? "")
            .toString()
            .toLowerCase();

        print("OBJECT => $label");

        if (label.contains("unknown")) {
          continue;
        }

        for (final key
        in animalMap.keys) {

          if (label.contains(key)) {

            count++;

            detectedAnimal =
            animalMap[key];

            break;
          }
        }

        if (detectedAnimal != null) {
          break;
        }
      }

      // =====================================================
      // UPDATE UI
      // =====================================================

      setState(() {

        _backendOnline = true;

        _detectionCount = count;

        _animalDetected =
            detectedAnimal != null;

        _detectedClass =
            detectedAnimal;
      });

      // =====================================================
      // SHOW POPUP
      // =====================================================

      if (detectedAnimal != null &&
          !_alertShown) {

        print(
          "SHOWING POPUP FOR => "
              "${detectedAnimal.label}",
        );

        Future.delayed(

          const Duration(milliseconds: 200),

              () {

            if (!mounted) return;

            _showAnimalPopup(
              detectedAnimal!,
            );
          },
        );
      }

    } catch (e) {

      print(
        "CAMERA SCREEN ERROR => $e",
      );

      if (!mounted) return;

      setState(() {

        _backendOnline = false;

        _animalDetected = false;

        _detectedClass = null;

        _detectionCount = 0;
      });
    }
  }

  // =========================================================
  // DISPOSE
  // =========================================================

  @override
  void dispose() {

    _pollTimer?.cancel();

    _gpsTimer?.cancel();

    _recordDot.dispose();

    _animalPulse.dispose();

    _scanLine.dispose();

    super.dispose();
  }

  // =========================================================
  // UI
  // =========================================================

  @override
  Widget build(BuildContext context) {

    final size =
        MediaQuery.of(context).size;

    return Scaffold(

      backgroundColor: Colors.black,

      body: Stack(

        fit: StackFit.expand,

        children: [

          // =================================================
          // CAMERA
          // =================================================

          if (_cameraActive)

            const WebCameraView()

          else

            RoadSimulation(
              scanCtrl: _scanLine,
            ),

          // =================================================
          // SCAN LINE
          // =================================================

          AnimatedBuilder(

            animation: _scanLine,

            builder: (_, __) =>

                CustomPaint(

                  painter:
                  ScanLinePainter(
                    _scanLine.value,
                  ),

                  size: size,
                ),
          ),

          // =================================================
          // HUD
          // =================================================

          const CornerBrackets(),

          // =================================================
          // DETECTION BOX
          // =================================================

          if (_animalDetected &&
              _detectedClass != null)

            DetectionBBoxOverlay(

              animalClass:
              _detectedClass!,

              confidence: 1.0,

              pulseController:
              _animalPulse,
            ),

          // =================================================
          // TOP HUD
          // =================================================

          TopHud(

            recordDot:
            _recordDot,

            isRecording:
            _isRecording,

            isOnline:
            _backendOnline,

            detectionCount:
            _detectionCount,
          ),

          // =================================================
          // LOCATION CHIP
          // =================================================

          Positioned(

            top: 70,

            left: 14,

            child: Container(

              padding:
              const EdgeInsets.symmetric(

                horizontal: 14,
                vertical: 8,
              ),

              decoration: BoxDecoration(

                color:
                Colors.black.withOpacity(
                    0.7),

                borderRadius:
                BorderRadius.circular(
                    30),

                border: Border.all(
                  color: Colors.white24,
                ),
              ),

              child: Row(

                children: [

                  const Icon(

                    Icons.location_on,

                    color: Colors.red,

                    size: 18,
                  ),

                  const SizedBox(width: 6),

                  Text(

                    _currentLocationName,

                    style: const TextStyle(

                      color: Colors.white,

                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // =================================================
          // TOAST
          // =================================================

          if (_animalDetected &&
              _detectedClass != null)

            Positioned(

              top: 120,

              left: 14,

              right: 14,

              child: DetectionToast(

                animalClass:
                _detectedClass!,
              ),
            ),

          // =================================================
          // CONTROLS
          // =================================================

          BottomBar(

            isRecording:
            _isRecording,

            cameraActive:
            _cameraActive,

            onToggleRecord: () {

              setState(() {

                _isRecording =
                !_isRecording;
              });
            },

            onToggleCamera: () {

              setState(() {

                _cameraActive =
                !_cameraActive;
              });
            },
          ),
        ],
      ),
    );
  }
}