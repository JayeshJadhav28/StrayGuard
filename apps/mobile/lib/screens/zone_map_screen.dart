// ============================================================
// STRAYGUARD - SMART ZONE MAP
// FULL UPDATED VERSION
// STATIC + DYNAMIC AI HOTSPOT ZONES
// GOOGLE MAP STYLE CONTROLS
// ============================================================

import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_cancellable_tile_provider/flutter_map_cancellable_tile_provider.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

import '../services/detection_storage.dart';

class ZoneMapScreen extends StatefulWidget {
  const ZoneMapScreen({super.key});

  @override
  State<ZoneMapScreen> createState() => _ZoneMapScreenState();
}

class _ZoneMapScreenState extends State<ZoneMapScreen> {
  // ==========================================================
  // MAP
  // ==========================================================

  final MapController _mapController = MapController();

  static const LatLng indiaCenter = LatLng(22.5937, 78.9629);

  LatLng? _currentPosition;

  LatLng? _destination;

  bool _loading = true;

  bool _routeLoading = false;

  bool _initialCameraDone = false;

  Timer? _gpsTimer;

  // ==========================================================
  // ROUTE
  // ==========================================================

  List<LatLng> _routePoints = [];

  double _routeDistance = 0;

  double _routeDuration = 0;

  // ==========================================================
  // ZONES
  // ==========================================================

  final List<Polygon> _zonePolygons = [];

  final List<Marker> _zoneMarkers = [];

  final List<Map<String, dynamic>> _allZones = [];

  final List<Map<String, dynamic>> _nearbyZones = [];

  // ==========================================================
  // SEARCH
  // ==========================================================

  final TextEditingController _destinationController = TextEditingController();

  // ==========================================================
  // ALERTS
  // ==========================================================

  bool _warningPopupShown = false;

  bool _strictPopupShown = false;

  // ==========================================================
  // INIT
  // ==========================================================

  @override
  void initState() {
    super.initState();

    _initialize();

    _gpsTimer = Timer.periodic(const Duration(seconds: 10), (_) {
      _silentGpsUpdate();

      _renderZones();
    });
  }

  // ==========================================================
  // INITIALIZE
  // ==========================================================

  Future<void> _initialize() async {
    await _loadGps();

    await _loadZones();

    _renderZones();
  }

  // ==========================================================
  // GPS
  // ==========================================================

  Future<void> _loadGps() async {
    try {
      final permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      final current = LatLng(position.latitude, position.longitude);

      if (!mounted) return;

      setState(() {
        _currentPosition = current;

        _loading = false;
      });

      if (!_initialCameraDone) {
        _initialCameraDone = true;

        _mapController.move(current, 13);
      }
    } catch (e) {
      debugPrint("GPS ERROR: $e");
    }
  }

  // ==========================================================
  // SILENT GPS UPDATE
  // ==========================================================

  Future<void> _silentGpsUpdate() async {
    try {
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      final current = LatLng(position.latitude, position.longitude);

      if (!mounted) return;

      setState(() {
        _currentPosition = current;
      });
    } catch (_) {}
  }

  // ==========================================================
  // LOAD STATIC ZONES
  // ==========================================================

  Future<void> _loadZones() async {
    try {
      final url = Uri.parse('http://192.168.153.225:8000/zones');

      final response = await http.get(url);

      final data = jsonDecode(response.body);

      final features = data['features'] ?? [];

      _allZones.clear();

      for (final feature in features) {
        final geometry = feature['geometry'];

        final properties = feature['properties'];

        if (geometry == null) continue;

        if (geometry['type'] != 'Polygon') {
          continue;
        }

        final coordinates = geometry['coordinates'][0];

        final points = coordinates.map<LatLng>((coord) {
          return LatLng(coord[1].toDouble(), coord[0].toDouble());
        }).toList();

        if (points.isEmpty) continue;

        final center = _calculateCenter(points);

        _allZones.add({
          "name": properties['name'] ?? "Animal Zone",

          "risk": properties['risk'] ?? "LOW",

          "points": points,

          "center": center,
        });
      }
    } catch (e) {
      debugPrint("ZONE ERROR: $e");
    }
  }

  // ==========================================================
  // CENTER
  // ==========================================================

  LatLng _calculateCenter(List<LatLng> points) {
    double lat = 0;

    double lng = 0;

    for (final p in points) {
      lat += p.latitude;

      lng += p.longitude;
    }

    return LatLng(lat / points.length, lng / points.length);
  }

  // ==========================================================
  // RENDER ZONES
  // ==========================================================

  void _renderZones() {
    _zonePolygons.clear();

    _zoneMarkers.clear();

    final zoom = _mapController.camera.zoom;

    // ======================================================
    // STATIC PRELOADED ZONES
    // ======================================================

    for (final zone in _allZones) {
      final LatLng center = zone['center'];

      final risk = zone['risk'].toString().toUpperCase();

      Color color = Colors.green;

      if (risk == "MEDIUM") {
        color = Colors.orange;
      }

      if (risk == "HIGH") {
        color = Colors.red;
      }

      _zonePolygons.add(
        Polygon(
          points: List<LatLng>.from(zone['points']),

          color: color.withOpacity(0.15),

          borderColor: color,

          borderStrokeWidth: zoom < 8 ? 1 : 2,
        ),
      );

      _zoneMarkers.add(
        Marker(
          point: center,

          width: 70,

          height: 70,

          child: Column(
            children: [
              Icon(Icons.pets, color: color, size: 32),

              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),

                decoration: BoxDecoration(
                  color: Colors.black87,

                  borderRadius: BorderRadius.circular(8),
                ),

                child: Text(
                  zone['name'],

                  style: const TextStyle(color: Colors.white, fontSize: 8),

                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      );
    }

    // ======================================================
    // DYNAMIC HOTSPOTS
    // ======================================================

    for (final zone in DetectionStorage.zones) {
      final count = zone.totalDetections;

      if (count < 20) continue;

      double lat = zone.latitude;

      double lng = zone.longitude;

      if (lat == 0 || lng == 0) {
        continue;
      }

      Color zoneColor = Colors.orange;

      if (count >= 50) {
        zoneColor = Colors.red;
      }

      final center = LatLng(lat, lng);

      final List<LatLng> circlePoints = [];

      const radiusKm = 0.5;

      for (int i = 0; i < 360; i += 10) {
        final angle = i * math.pi / 180;

        final dx = radiusKm * 1000 * math.cos(angle);

        final dy = radiusKm * 1000 * math.sin(angle);

        final newLat = lat + (dy / 111320);

        final newLng = lng + (dx / (111320 * math.cos(lat * math.pi / 180)));

        circlePoints.add(LatLng(newLat, newLng));
      }

      _zonePolygons.add(
        Polygon(
          points: circlePoints,

          color: zoneColor.withOpacity(0.25),

          borderColor: zoneColor,

          borderStrokeWidth: 3,
        ),
      );

      _zoneMarkers.add(
        Marker(
          point: center,

          width: 160,

          height: 100,

          child: Column(
            children: [
              Icon(Icons.warning_rounded, color: zoneColor, size: 38),

              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),

                decoration: BoxDecoration(
                  color: Colors.black87,

                  borderRadius: BorderRadius.circular(10),
                ),

                child: Text(
                  "${zone.location}\n$count detections",

                  textAlign: TextAlign.center,

                  style: const TextStyle(
                    color: Colors.white,

                    fontSize: 10,

                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (mounted) {
      setState(() {});
    }
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  Future<List<dynamic>> searchPlaces(String query) async {
    if (query.isEmpty) return [];

    final url = Uri.parse(
      'https://nominatim.openstreetmap.org/search'
      '?q=$query'
      '&format=json'
      '&countrycodes=in'
      '&limit=6',
    );

    final response = await http.get(url, headers: {'User-Agent': 'strayguard'});

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  // ==========================================================
  // WARNING POPUP
  // ==========================================================

  void _showWarningPopup() {
    if (_warningPopupShown) return;

    _warningPopupShown = true;

    showDialog(
      context: context,

      builder: (_) {
        return AlertDialog(
          title: const Text("⚠ Wildlife Zone Ahead"),

          content: const Text(
            "Animal zone nearby.\n\n"
            "Recommended speed limit:\n"
            "40 KM/H",
          ),

          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);

                _warningPopupShown = false;
              },

              child: const Text("OK"),
            ),
          ],
        );
      },
    );
  }

  // ==========================================================
  // STRICT POPUP
  // ==========================================================

  void _showStrictPopup() {
    if (_strictPopupShown) return;

    _strictPopupShown = true;

    showDialog(
      context: context,

      barrierDismissible: false,

      builder: (_) {
        return AlertDialog(
          backgroundColor: Colors.red,

          title: const Text(
            "🚨 STRICT WILDLIFE ZONE",

            style: TextStyle(color: Colors.white),
          ),

          content: const Text(
            "STRICT SPEED LIMIT\n\n"
            "40 KM/H\n\n"
            "High animal crossing risk detected.",

            style: TextStyle(color: Colors.white),
          ),

          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);

                _strictPopupShown = false;
              },

              child: const Text("UNDERSTOOD"),
            ),
          ],
        );
      },
    );
  }

  // ==========================================================
  // BUILD ROUTE
  // ==========================================================

  Future<void> _buildRoute(LatLng destination) async {
    if (_currentPosition == null) {
      return;
    }

    setState(() {
      _routeLoading = true;
    });

    try {
      final url = Uri.parse(
        'https://router.project-osrm.org/route/v1/driving/'
        '${_currentPosition!.longitude},${_currentPosition!.latitude};'
        '${destination.longitude},${destination.latitude}'
        '?overview=full'
        '&geometries=geojson',
      );

      final response = await http.get(url);

      final data = jsonDecode(response.body);

      final route = data['routes'][0];

      final geometry = route['geometry']['coordinates'];

      final distance = route['distance'];

      final duration = route['duration'];

      final points = geometry.map<LatLng>((coord) {
        return LatLng(coord[1], coord[0]);
      }).toList();

      _nearbyZones.clear();

      bool reminderShown = false;

      bool strictShown = false;

      for (final point in points) {
        for (final zone in _allZones) {
          final LatLng center = zone['center'];

          final km = const Distance().as(LengthUnit.Kilometer, point, center);

          if (km <= 10) {
            final alreadyExists = _nearbyZones.any(
              (z) => z['name'] == zone['name'],
            );

            if (!alreadyExists) {
              _nearbyZones.add({
                "name": zone['name'],

                "risk": zone['risk'],

                "distance": km.toStringAsFixed(1),
              });
            }

            if (km <= 10 && km > 5 && !reminderShown) {
              reminderShown = true;

              _showWarningPopup();
            }

            if (km <= 5 && !strictShown) {
              strictShown = true;

              _showStrictPopup();
            }
          }
        }
      }

      if (!mounted) return;

      setState(() {
        _destination = destination;

        _routePoints = points;

        _routeDistance = distance / 1000;

        _routeDuration = duration / 60;

        _routeLoading = false;
      });

      _mapController.fitCamera(
        CameraFit.bounds(
          bounds: LatLngBounds.fromPoints(points),

          padding: const EdgeInsets.all(80),
        ),
      );
    } catch (e) {
      debugPrint("ROUTE ERROR: $e");

      setState(() {
        _routeLoading = false;
      });
    }
  }

  // ==========================================================
  // INFO
  // ==========================================================

  Widget _info(String title, String value) {
    return Column(
      children: [
        Text(title, style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),

        Text(value, style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
      ],
    );
  }

  // ==========================================================
  // DISPOSE
  // ==========================================================

  @override
  void dispose() {
    _gpsTimer?.cancel();

    _destinationController.dispose();

    super.dispose();
  }

  // ==========================================================
  // UI
  // ==========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Stack(
              children: [
                // ==================================================
                // MAP
                // ==================================================
                FlutterMap(
                  mapController: _mapController,

                  options: MapOptions(
                    initialCenter: _currentPosition!,

                    initialZoom: 13,

                    minZoom: 5,

                    maxZoom: 18,

                    interactionOptions: const InteractionOptions(
                      flags: InteractiveFlag.all,
                    ),

                    onPositionChanged: (position, hasGesture) {
                      _renderZones();
                    },
                  ),

                  children: [
                    TileLayer(
                      urlTemplate:
                          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

                      retinaMode: true,

                      tileProvider: CancellableNetworkTileProvider(),

                      userAgentPackageName: 'com.strayguard.app',
                    ),

                    PolygonLayer(polygons: _zonePolygons),

                    if (_routePoints.isNotEmpty)
                      PolylineLayer(
                        polylines: [
                          Polyline(
                            points: _routePoints,

                            strokeWidth: 5,

                            color: Colors.blue,
                          ),
                        ],
                      ),

                    MarkerLayer(
                      markers: [
                        ..._zoneMarkers,

                        if (_currentPosition != null)
                          Marker(
                            point: _currentPosition!,

                            width: 60,

                            height: 60,

                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.blue,

                                shape: BoxShape.circle,

                                border: Border.all(
                                  color: Colors.white,

                                  width: 4,
                                ),
                              ),

                              child: const Icon(
                                Icons.navigation,

                                color: Colors.white,
                              ),
                            ),
                          ),

                        if (_destination != null)
                          Marker(
                            point: _destination!,

                            width: 60,

                            height: 60,

                            child: const Icon(
                              Icons.location_pin,

                              color: Colors.red,

                              size: 50,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),

                // ==================================================
                // SEARCH PANEL
                // ==================================================
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(16),

                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(14),

                          decoration: BoxDecoration(
                            color: Colors.white,

                            borderRadius: BorderRadius.circular(18),

                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.08),

                                blurRadius: 12,
                              ),
                            ],
                          ),

                          child: Column(
                            children: [
                              TypeAheadField<dynamic>(
                                suggestionsCallback: searchPlaces,

                                itemBuilder: (context, suggestion) {
                                  return ListTile(
                                    leading: const Icon(Icons.place),

                                    title: Text(
                                      suggestion['display_name'],

                                      maxLines: 1,

                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  );
                                },

                                onSelected: (suggestion) async {
                                  final lat = double.parse(suggestion['lat']);

                                  final lon = double.parse(suggestion['lon']);

                                  await _buildRoute(LatLng(lat, lon));
                                },

                                builder: (context, controller, focusNode) {
                                  return TextField(
                                    controller: controller,

                                    focusNode: focusNode,

                                    decoration: InputDecoration(
                                      hintText: "Search destination",

                                      filled: true,

                                      fillColor: Colors.grey.shade100,

                                      prefixIcon: const Icon(Icons.search),

                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(16),

                                        borderSide: BorderSide.none,
                                      ),
                                    ),
                                  );
                                },
                              ),

                              if (_routeLoading)
                                const Padding(
                                  padding: EdgeInsets.only(top: 12),

                                  child: LinearProgressIndicator(),
                                ),

                              if (_routeDistance > 0)
                                Padding(
                                  padding: const EdgeInsets.only(top: 14),

                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,

                                    children: [
                                      _info(
                                        "ETA",

                                        "${_routeDuration.toStringAsFixed(0)} min",
                                      ),

                                      _info(
                                        "Distance",

                                        "${_routeDistance.toStringAsFixed(1)} km",
                                      ),

                                      _info("Zones", "${_nearbyZones.length}"),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // ==================================================
                // MAP CONTROLS
                // ==================================================
                Positioned(
                  right: 16,

                  bottom: 20,

                  child: Column(
                    children: [
                      FloatingActionButton(
                        mini: true,

                        heroTag: "zoomIn",

                        onPressed: () {
                          _mapController.move(
                            _mapController.camera.center,

                            _mapController.camera.zoom + 1,
                          );
                        },

                        child: const Icon(Icons.add),
                      ),

                      const SizedBox(height: 10),

                      FloatingActionButton(
                        mini: true,

                        heroTag: "zoomOut",

                        onPressed: () {
                          _mapController.move(
                            _mapController.camera.center,

                            _mapController.camera.zoom - 1,
                          );
                        },

                        child: const Icon(Icons.remove),
                      ),

                      const SizedBox(height: 10),

                      FloatingActionButton(
                        heroTag: "india",

                        backgroundColor: Colors.blue,

                        onPressed: () {
                          _mapController.move(indiaCenter, 5.2);
                        },

                        child: const Icon(Icons.public),
                      ),

                      const SizedBox(height: 10),

                      FloatingActionButton(
                        heroTag: "location",

                        backgroundColor: Colors.blue,

                        onPressed: () {
                          if (_currentPosition == null) {
                            return;
                          }

                          _mapController.move(_currentPosition!, 14);
                        },

                        child: const Icon(Icons.my_location),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
