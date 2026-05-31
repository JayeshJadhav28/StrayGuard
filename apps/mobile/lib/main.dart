import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'theme/app_theme.dart';
import 'screens/splash_screen.dart';

import 'services/gps_uploader.dart';

void main() async {

  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness:
      Brightness.light,
      systemNavigationBarColor:
      AppColors.background,
      systemNavigationBarIconBrightness:
      Brightness.light,
    ),
  );

  // START LIVE GPS UPLOAD
  final gps = GpsUploader();

  await gps.start();

  runApp(const StrayGuardApp());
}

class StrayGuardApp extends StatelessWidget {
  const StrayGuardApp({super.key});

  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      title: 'StrayGuard',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      home: const SplashScreen(),
    );
  }
}