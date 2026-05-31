import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/detection_event.dart';

class DetectionBBoxOverlay extends StatelessWidget {
  final AnimalClass animalClass;
  final double confidence;
  final AnimationController pulseController;

  const DetectionBBoxOverlay({super.key, required this.animalClass, required this.confidence, required this.pulseController});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Positioned(
      left: size.width * 0.22,
      top: size.height * 0.36,
      child: AnimatedBuilder(
        animation: pulseController,
        builder: (_, __) {
          final glow = 0.4 + 0.6 * pulseController.value;
          return Container(
            width: size.width * 0.42,
            height: size.height * 0.22,
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.danger.withOpacity(0.7 + 0.3 * pulseController.value), width: 2.0),
              borderRadius: BorderRadius.circular(4),
              boxShadow: [BoxShadow(color: AppColors.danger.withOpacity(0.3 * glow), blurRadius: 12)],
            ),
            child: Stack(children: [
              // Corner accents
              ..._corners(size.width * 0.42, size.height * 0.22),
              // Label
              Positioned(
                top: -1,
                left: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: AppColors.danger, borderRadius: const BorderRadius.only(topLeft: Radius.circular(3), bottomRight: Radius.circular(6))),
                  child: Text('${animalClass.label}  ${(confidence * 100).toInt()}%',
                      style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                ),
              ),
            ]),
          );
        },
      ),
    );
  }

  List<Widget> _corners(double w, double h) {
    const len = 14.0;
    const thick = 2.5;
    final color = AppColors.danger;
    Widget corner(AlignmentGeometry align, BorderRadius br) => Positioned.fill(
      child: Align(alignment: align, child: SizedBox(width: len, height: len,
        child: DecoratedBox(decoration: BoxDecoration(border: Border.all(color: color, width: 0), borderRadius: br,
          boxShadow: [BoxShadow(color: color.withOpacity(0.8), blurRadius: 4)]))),
      ),
    );
    // Simple corner lines via CustomPaint
    return [
      Positioned(top: 0, left: 0, child: _CornerLine(color: color, len: len, thick: thick, top: true, left: true)),
      Positioned(top: 0, right: 0, child: _CornerLine(color: color, len: len, thick: thick, top: true, left: false)),
      Positioned(bottom: 0, left: 0, child: _CornerLine(color: color, len: len, thick: thick, top: false, left: true)),
      Positioned(bottom: 0, right: 0, child: _CornerLine(color: color, len: len, thick: thick, top: false, left: false)),
    ];
  }
}

class _CornerLine extends StatelessWidget {
  final Color color;
  final double len, thick;
  final bool top, left;
  const _CornerLine({required this.color, required this.len, required this.thick, required this.top, required this.left});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(len, len),
      painter: _CornerPainter(color: color, thick: thick, top: top, left: left),
    );
  }
}

class _CornerPainter extends CustomPainter {
  final Color color;
  final double thick;
  final bool top, left;
  _CornerPainter({required this.color, required this.thick, required this.top, required this.left});

  @override
  void paint(Canvas canvas, Size s) {
    final p = Paint()..color = color..strokeWidth = thick..style = PaintingStyle.stroke..strokeCap = StrokeCap.square;
    final x = left ? 0.0 : s.width;
    final y = top ? 0.0 : s.height;
    canvas.drawLine(Offset(x, y), Offset(left ? s.width : 0, y), p);
    canvas.drawLine(Offset(x, y), Offset(x, top ? s.height : 0), p);
  }

  @override
  bool shouldRepaint(_CornerPainter old) => false;
}
