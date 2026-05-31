// lib/screens/camera_painters.dart

import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class RoadSimulation extends StatelessWidget {
  final AnimationController scanCtrl;

  const RoadSimulation({
    super.key,
    required this.scanCtrl,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: scanCtrl,
      builder: (_, __) => CustomPaint(
        painter: RoadPainter(scanCtrl.value),
        size: MediaQuery.of(context).size,
      ),
    );
  }
}

class RoadPainter extends CustomPainter {
  final double t;

  RoadPainter(this.t);

  @override
  void paint(Canvas canvas, Size s) {
    // SKY
    canvas.drawRect(
      Rect.fromLTWH(0, 0, s.width, s.height * 0.44),
      Paint()
        ..shader = const LinearGradient(
          colors: [
            Color(0xFF010610),
            Color(0xFF030C1C),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ).createShader(
          Rect.fromLTWH(0, 0, s.width, s.height),
        ),
    );

    // STARS
    final starPaint = Paint()
      ..color = Colors.white.withOpacity(0.4);

    final rng = Random(42);

    for (int i = 0; i < 60; i++) {
      final x = rng.nextDouble() * s.width;
      final y = rng.nextDouble() * s.height * 0.38;

      canvas.drawCircle(
        Offset(x, y),
        rng.nextDouble() * 1.2,
        starPaint,
      );
    }

    // GROUND
    canvas.drawRect(
      Rect.fromLTWH(
        0,
        s.height * 0.42,
        s.width,
        s.height * 0.58,
      ),
      Paint()
        ..shader = const LinearGradient(
          colors: [
            Color(0xFF0D131C),
            Color(0xFF181F2C),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ).createShader(
          Rect.fromLTWH(
            0,
            s.height * 0.42,
            s.width,
            s.height * 0.58,
          ),
        ),
    );

    // ROAD GLOW
    canvas.drawRect(
      Rect.fromLTWH(
        0,
        s.height * 0.415,
        s.width,
        80,
      ),
      Paint()
        ..shader = LinearGradient(
          colors: [
            Colors.transparent,
            AppColors.primary.withOpacity(0.08),
            Colors.transparent,
          ],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ).createShader(
          Rect.fromLTWH(
            0,
            s.height * 0.415,
            s.width,
            80,
          ),
        ),
    );

    // ROAD EDGES
    final edgePaint = Paint()
      ..color = Colors.white.withOpacity(0.6)
      ..strokeWidth = 2;

    canvas.drawLine(
      Offset(s.width * 0.10, s.height),
      Offset(s.width * 0.42, s.height * 0.46),
      edgePaint,
    );

    canvas.drawLine(
      Offset(s.width * 0.90, s.height),
      Offset(s.width * 0.58, s.height * 0.46),
      edgePaint,
    );

    // CENTER DASHES
    final dashPaint = Paint()
      ..color = AppColors.primary.withOpacity(0.45)
      ..strokeWidth = 2.5;

    for (int i = 0; i < 9; i++) {
      final frac = ((i / 9.0) + t) % 1.0;

      final y =
          s.height * 0.46 +
              (s.height * 0.54 * frac);

      final half = 14 + (22 * frac);

      canvas.drawLine(
        Offset(s.width / 2, y - half),
        Offset(s.width / 2, y + half),
        dashPaint,
      );
    }

    // CITY GLOW
    final cityGlow = Paint()
      ..color = AppColors.primary.withOpacity(0.06)
      ..maskFilter = const MaskFilter.blur(
        BlurStyle.normal,
        40,
      );

    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(
          s.width / 2,
          s.height * 0.44,
        ),
        width: s.width * 0.8,
        height: 60,
      ),
      cityGlow,
    );
  }

  @override
  bool shouldRepaint(covariant RoadPainter oldDelegate) {
    return oldDelegate.t != t;
  }
}

class ScanLinePainter extends CustomPainter {
  final double t;

  ScanLinePainter(this.t);

  @override
  void paint(Canvas canvas, Size size) {
    final y = t * size.height;

    canvas.drawRect(
      Rect.fromLTWH(
        0,
        y - 50,
        size.width,
        100,
      ),
      Paint()
        ..shader = LinearGradient(
          colors: [
            Colors.transparent,
            AppColors.primary.withOpacity(0.04),
            AppColors.primary.withOpacity(0.07),
            AppColors.primary.withOpacity(0.04),
            Colors.transparent,
          ],
          stops: const [
            0.0,
            0.3,
            0.5,
            0.7,
            1.0,
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ).createShader(
          Rect.fromLTWH(
            0,
            y - 50,
            size.width,
            100,
          ),
        ),
    );
  }

  @override
  bool shouldRepaint(covariant ScanLinePainter oldDelegate) {
    return oldDelegate.t != t;
  }
}