import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/detection_event.dart';

class ISABanner extends StatelessWidget {
  final ISAState isaState;
  final int recommendedSpeed;
  final int currentSpeed;
  final String zoneCode;

  const ISABanner({super.key, required this.isaState, required this.recommendedSpeed, required this.currentSpeed, required this.zoneCode});

  @override
  Widget build(BuildContext context) {
    if (isaState == ISAState.normal) return const SizedBox.shrink();

    final color = _color;
    final icon = _icon;
    final title = _title;
    final subtitle = _subtitle;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 350),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.6), width: 1.5),
        boxShadow: [BoxShadow(color: color.withOpacity(0.25), blurRadius: 24, spreadRadius: 1)],
      ),
      child: Row(children: [
        Container(
          width: 44, height: 44,
          decoration: BoxDecoration(color: color.withOpacity(0.18), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: color, size: 24),
        ),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color, letterSpacing: 1.2)),
          const SizedBox(height: 2),
          Text(subtitle, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          const SizedBox(height: 2),
          Text(zoneCode, style: GoogleFonts.inter(fontSize: 10, color: AppColors.textMuted)),
        ])),
        Column(children: [
          Text('$recommendedSpeed', style: GoogleFonts.orbitron(fontSize: 28, fontWeight: FontWeight.w800, color: color)),
          Text('km/h', style: GoogleFonts.inter(fontSize: 10, color: AppColors.textMuted)),
        ]),
        const SizedBox(width: 4),
      ]),
    );
  }

  Color get _color {
    switch (isaState) {
      case ISAState.compliant: return AppColors.safe;
      case ISAState.advisory: return AppColors.warning;
      case ISAState.breach: return AppColors.danger;
      case ISAState.critical: return AppColors.critical;
      case ISAState.normal: return Colors.transparent;
    }
  }

  IconData get _icon {
    switch (isaState) {
      case ISAState.compliant: return Icons.check_circle_outline_rounded;
      case ISAState.advisory: return Icons.warning_amber_rounded;
      case ISAState.breach: return Icons.speed_rounded;
      case ISAState.critical: return Icons.crisis_alert_rounded;
      case ISAState.normal: return Icons.circle;
    }
  }

  String get _title {
    switch (isaState) {
      case ISAState.compliant: return 'ANIMAL-RISK ZONE · SAFE SPEED';
      case ISAState.advisory: return 'SPEED ADVISORY ACTIVE';
      case ISAState.breach: return '⚠  REDUCE SPEED NOW';
      case ISAState.critical: return '🚨 CRITICAL SPEED BREACH';
      case ISAState.normal: return '';
    }
  }

  String get _subtitle {
    switch (isaState) {
      case ISAState.compliant: return 'Good — you\'re within safe speed';
      case ISAState.advisory: return 'Slow down — ${currentSpeed - recommendedSpeed} km/h over advisory';
      case ISAState.breach: return 'Animal risk zone — reduce to $recommendedSpeed km/h';
      case ISAState.critical: return 'URGENT — ${currentSpeed - recommendedSpeed} km/h above safe speed';
      case ISAState.normal: return '';
    }
  }
}
