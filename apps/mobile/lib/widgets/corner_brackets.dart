import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class CornerBrackets extends StatelessWidget {
  const CornerBrackets({super.key});

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(child: CustomPaint(painter: _BracketPainter()));
  }
}

class _BracketPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size s) {
    final p = Paint()
      ..color = AppColors.primary.withOpacity(0.55)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square;
    const len = 26.0;
    const pad = 22.0;

    // Top-left
    canvas.drawLine(Offset(pad, pad + len), Offset(pad, pad), p);
    canvas.drawLine(Offset(pad, pad), Offset(pad + len, pad), p);
    // Top-right
    canvas.drawLine(
      Offset(s.width - pad - len, pad),
      Offset(s.width - pad, pad),
      p,
    );
    canvas.drawLine(
      Offset(s.width - pad, pad),
      Offset(s.width - pad, pad + len),
      p,
    );
    // Bottom-left
    canvas.drawLine(
      Offset(pad, s.height - pad - len),
      Offset(pad, s.height - pad),
      p,
    );
    canvas.drawLine(
      Offset(pad, s.height - pad),
      Offset(pad + len, s.height - pad),
      p,
    );
    // Bottom-right
    canvas.drawLine(
      Offset(s.width - pad - len, s.height - pad),
      Offset(s.width - pad, s.height - pad),
      p,
    );
    canvas.drawLine(
      Offset(s.width - pad, s.height - pad),
      Offset(s.width - pad, s.height - pad - len),
      p,
    );
  }

  @override
  bool shouldRepaint(_BracketPainter old) => false;
}
