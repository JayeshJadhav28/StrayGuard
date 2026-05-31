import 'dart:async';
import 'dart:convert';

import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;

class GpsUploader {
  static const String backend = 'http://192.168.153.225:8000/gps';

  Timer? _timer;

  Future<void> start() async {
    bool enabled = await Geolocator.isLocationServiceEnabled();

    if (!enabled) {
      print('GPS DISABLED');
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }

    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      print('LOCATION PERMISSION DENIED');
      return;
    }

    _timer = Timer.periodic(const Duration(seconds: 2), (_) async {
      try {
        final pos = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.best,
        );

        final response = await http.post(
          Uri.parse(backend),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'lat': pos.latitude, 'lon': pos.longitude}),
        );

        print(
          'GPS SENT → '
          '${pos.latitude}, '
          '${pos.longitude}',
        );

        print(response.body);
      } catch (e) {
        print('GPS ERROR: $e');
      }
    });
  }

  void stop() {
    _timer?.cancel();
  }
}
