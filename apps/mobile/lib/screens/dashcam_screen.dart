import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/detection_event.dart';
import '../widgets/isa_banner.dart';
import '../widgets/speed_hud.dart';
import '../widgets/detection_bbox_overlay.dart';
import '../widgets/corner_brackets.dart';

class DashcamScreen extends StatefulWidget {
  const DashcamScreen({super.key});
  @override
  State<DashcamScreen> createState() => _DashcamScreenState();
}

class _DashcamScreenState extends State<DashcamScreen> with TickerProviderStateMixin {
  double _currentSpeed = 54.0;
  ISAState _isaState = ISAState.advisory;
  int _recommendedSpeed = 43;
  bool _animalDetected = false;
  AnimalClass? _detectedClass;
  double _confidence = 0.0;
  bool _isRecording = true;
  bool _isOnline = true;
  int _detectionCount = 3;
  int _fps = 4;
  final Random _rng = Random();

  late AnimationController _recordDot;
  late AnimationController _animalPulse;
  late AnimationController _road;
  Timer? _demo;
  Timer? _fpsTick;

  @override
  void initState() {
    super.initState();
    _recordDot = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))..repeat(reverse: true);
    _animalPulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 700))..repeat(reverse: true);
    _road = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();

    _demo = Timer.periodic(const Duration(seconds: 5), (_) {
      if (!mounted) return;
      setState(() {
        _currentSpeed = 36 + _rng.nextDouble() * 44;
        final roll = _rng.nextDouble();
        if (roll > 0.45) {
          _animalDetected = true;
          _detectedClass = AnimalClass.values[_rng.nextInt(6)];
          _confidence = 0.65 + _rng.nextDouble() * 0.30;
          _detectionCount++;
        } else {
          _animalDetected = false;
        }
        if (_currentSpeed > _recommendedSpeed + 10) {
          _isaState = ISAState.breach;
        } else if (_currentSpeed > _recommendedSpeed) {
          _isaState = ISAState.advisory;
        } else {
          _isaState = ISAState.compliant;
        }
      });
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) setState(() => _animalDetected = false);
      });
    });
    _fpsTick = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _fps = 3 + _rng.nextInt(2));
    });
  }

  @override
  void dispose() {
    _recordDot.dispose();
    _animalPulse.dispose();
    _road.dispose();
    _demo?.cancel();
    _fpsTick?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          _RoadView(controller: _road),
          if (_isaState != ISAState.normal)
            AnimatedContainer(
              duration: const Duration(milliseconds: 400),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [_isaColor.withOpacity(0.07), Colors.transparent, Colors.transparent, _isaColor.withOpacity(0.05)],
                ),
              ),
            ),
          const CornerBrackets(),
          if (_animalDetected && _detectedClass != null)
            DetectionBBoxOverlay(animalClass: _detectedClass!, confidence: _confidence, pulseController: _animalPulse),
          _TopBar(recordDot: _recordDot, isRecording: _isRecording, fps: _fps, isOnline: _isOnline, detectionCount: _detectionCount),
          Positioned(
            right: 16,
            top: MediaQuery.of(context).size.height * 0.18,
            child: SpeedHud(currentSpeed: _currentSpeed.toInt(), recommendedSpeed: _recommendedSpeed, isaState: _isaState),
          ),
          Positioned(
            bottom: 155,
            left: 16,
            right: 16,
            child: ISABanner(isaState: _isaState, recommendedSpeed: _recommendedSpeed, currentSpeed: _currentSpeed.toInt(), zoneCode: 'DZ-NH48-007'),
          ),
          if (_animalDetected && _detectedClass != null)
            Positioned(
              top: 100,
              left: 16,
              right: 16,
              child: _DetectionAlert(animalClass: _detectedClass!, confidence: _confidence),
            ),
          _BottomBar(isRecording: _isRecording, onToggle: () => setState(() => _isRecording = !_isRecording)),
        ],
      ),
    );
  }

  Color get _isaColor {
    switch (_isaState) {
      case ISAState.normal: return Colors.transparent;
      case ISAState.compliant: return AppColors.safe;
      case ISAState.advisory: return AppColors.warning;
      case ISAState.breach: return AppColors.danger;
      case ISAState.critical: return AppColors.critical;
    }
  }
}

class _RoadView extends StatelessWidget {
  final AnimationController controller;
  const _RoadView({required this.controller});
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (_, __) => CustomPaint(painter: _RoadPainter(controller.value), size: MediaQuery.of(context).size),
    );
  }
}

class _RoadPainter extends CustomPainter {
  final double t;
  _RoadPainter(this.t);

  @override
  void paint(Canvas canvas, Size s) {
    canvas.drawRect(Rect.fromLTWH(0, 0, s.width, s.height * 0.46),
        Paint()..shader = const LinearGradient(colors: [Color(0xFF04090F), Color(0xFF0A1428)], begin: Alignment.topCenter, end: Alignment.bottomCenter).createShader(Rect.fromLTWH(0, 0, s.width, s.height)));
    canvas.drawRect(Rect.fromLTWH(0, s.height * 0.42, s.width, s.height * 0.58),
        Paint()..shader = LinearGradient(colors: const [Color(0xFF141A22), Color(0xFF1A2230)], begin: Alignment.topCenter, end: Alignment.bottomCenter).createShader(Rect.fromLTWH(0, s.height * 0.42, s.width, s.height * 0.58)));

    final glow = Paint()
      ..shader = LinearGradient(colors: [Colors.transparent, AppColors.primary.withOpacity(0.10), Colors.transparent],
          begin: Alignment.centerLeft, end: Alignment.centerRight)
          .createShader(Rect.fromLTWH(0, s.height * 0.43, s.width, 70));
    canvas.drawRect(Rect.fromLTWH(0, s.height * 0.43, s.width, 70), glow);

    final edge = Paint()..color = Colors.white70..strokeWidth = 2.5..style = PaintingStyle.stroke;
    canvas.drawLine(Offset(s.width * 0.10, s.height), Offset(s.width * 0.41, s.height * 0.47), edge);
    canvas.drawLine(Offset(s.width * 0.90, s.height), Offset(s.width * 0.59, s.height * 0.47), edge);

    final dash = Paint()..color = Colors.white.withOpacity(0.55)..strokeWidth = 2.5..style = PaintingStyle.stroke;
    for (int i = 0; i < 8; i++) {
      final frac = ((i / 8.0) + t) % 1.0;
      final y = s.height * 0.47 + s.height * 0.53 * frac;
      final half = 16 + 20 * frac;
      canvas.drawLine(Offset(s.width / 2, y - half), Offset(s.width / 2, y + half), dash);
    }

    for (final pos in [Offset(s.width * 0.04, s.height * 0.43), Offset(s.width * 0.93, s.height * 0.42)]) {
      _tree(canvas, pos, 60);
    }
  }

  void _tree(Canvas canvas, Offset o, double h) {
    final p = Paint()..color = const Color(0xFF060C14);
    canvas.drawRect(Rect.fromCenter(center: Offset(o.dx, o.dy + h * 0.25), width: 7, height: h * 0.5), p);
    final tri = Path()..moveTo(o.dx, o.dy - h * 0.5)..lineTo(o.dx - 18, o.dy)..lineTo(o.dx + 18, o.dy)..close();
    canvas.drawPath(tri, p);
  }

  @override
  bool shouldRepaint(_RoadPainter old) => old.t != t;
}

class _TopBar extends StatelessWidget {
  final AnimationController recordDot;
  final bool isRecording, isOnline;
  final int fps, detectionCount;
  const _TopBar({required this.recordDot, required this.isRecording, required this.fps, required this.isOnline, required this.detectionCount});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    return Positioned(
      top: 0, left: 0, right: 0,
      child: Container(
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 8, left: 16, right: 16, bottom: 12),
        decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.black.withOpacity(0.8), Colors.transparent])),
        child: Row(children: [
          AnimatedBuilder(animation: recordDot, builder: (_, __) => Row(children: [
            Container(width: 9, height: 9, decoration: BoxDecoration(shape: BoxShape.circle, color: isRecording ? Color.lerp(AppColors.danger, Colors.redAccent, recordDot.value)! : AppColors.textMuted, boxShadow: isRecording ? [BoxShadow(color: AppColors.danger.withOpacity(0.6), blurRadius: 6)] : null)),
            const SizedBox(width: 5),
            Text(isRecording ? 'REC' : 'PAUSE', style: GoogleFonts.orbitron(fontSize: 10, fontWeight: FontWeight.w700, color: isRecording ? AppColors.danger : AppColors.textMuted, letterSpacing: 1)),
          ])),
          const SizedBox(width: 10),
          _Chip('${fps}fps', AppColors.textSecondary),
          const SizedBox(width: 5),
          _Chip(isOnline ? '4G' : 'OFF', isOnline ? AppColors.safe : AppColors.warning, icon: isOnline ? Icons.signal_cellular_alt : Icons.signal_cellular_off_rounded),
          const Spacer(),
          _Chip('$detectionCount DETECTED', AppColors.primary, icon: Icons.pets_rounded),
          const SizedBox(width: 8),
          Text('${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}',
              style: GoogleFonts.orbitron(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary, letterSpacing: 1)),
        ]),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  final String label;
  final Color color;
  final IconData? icon;
  const _Chip(this.label, this.color, {this.icon});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(5), border: Border.all(color: color.withOpacity(0.4), width: 0.8)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        if (icon != null) ...[Icon(icon, size: 9, color: color), const SizedBox(width: 3)],
        Text(label, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: color, letterSpacing: 0.5)),
      ]),
    );
  }
}

class _DetectionAlert extends StatelessWidget {
  final AnimalClass animalClass;
  final double confidence;
  const _DetectionAlert({required this.animalClass, required this.confidence});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(color: AppColors.danger.withOpacity(0.15), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.danger, width: 1.5), boxShadow: [BoxShadow(color: AppColors.danger.withOpacity(0.3), blurRadius: 20)]),
      child: Row(children: [
        Container(width: 38, height: 38, decoration: BoxDecoration(color: AppColors.danger.withOpacity(0.2), borderRadius: BorderRadius.circular(8)), child: Center(child: Text(animalClass.emoji, style: const TextStyle(fontSize: 20)))),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('⚠  ANIMAL DETECTED', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.danger, letterSpacing: 1.5)),
          const SizedBox(height: 2),
          Text('${animalClass.label}  ·  ${(confidence * 100).toInt()}% confidence', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        ])),
        Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(6)), child: Text('ALERT', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white, letterSpacing: 1))),
      ]),
    ).animate().slideY(begin: -0.3, end: 0, duration: 300.ms).fadeIn(duration: 250.ms);
  }
}

class _BottomBar extends StatelessWidget {
  final bool isRecording;
  final VoidCallback onToggle;
  const _BottomBar({required this.isRecording, required this.onToggle});
  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 0, left: 0, right: 0,
      child: Container(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom + 76, left: 20, right: 20, top: 12),
        decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.bottomCenter, end: Alignment.topCenter, colors: [Colors.black.withOpacity(0.85), Colors.transparent])),
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
            Text('NH48 · km 215', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
            const SizedBox(height: 2),
            Row(children: [const Icon(Icons.location_on, size: 11, color: AppColors.primary), const SizedBox(width: 3), Text('28.6139° N  77.2090° E', style: GoogleFonts.inter(fontSize: 10, color: AppColors.textMuted))]),
          ]),
          GestureDetector(
            onTap: onToggle,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: 54, height: 54,
              decoration: BoxDecoration(shape: BoxShape.circle, color: (isRecording ? AppColors.danger : AppColors.safe).withOpacity(0.2), border: Border.all(color: isRecording ? AppColors.danger : AppColors.safe, width: 2.5), boxShadow: [BoxShadow(color: (isRecording ? AppColors.danger : AppColors.safe).withOpacity(0.4), blurRadius: 16)]),
              child: Icon(isRecording ? Icons.stop_rounded : Icons.play_arrow_rounded, color: isRecording ? AppColors.danger : AppColors.safe, size: 28),
            ),
          ),
          Column(crossAxisAlignment: CrossAxisAlignment.end, mainAxisSize: MainAxisSize.min, children: [
            Text('MobileNet-SSD v2', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
            const SizedBox(height: 2),
            Row(children: [Container(width: 6, height: 6, decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.safe)), const SizedBox(width: 4), Text('INT8 · NNAPI', style: GoogleFonts.inter(fontSize: 10, color: AppColors.textMuted))]),
          ]),
        ]),
      ),
    );
  }
}
