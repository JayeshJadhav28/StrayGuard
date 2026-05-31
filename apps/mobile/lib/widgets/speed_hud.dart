import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/detection_event.dart';

class SpeedHud extends StatelessWidget {
  final int currentSpeed;
  final int recommendedSpeed;
  final ISAState isaState;

  const SpeedHud({
    super.key,
    required this.currentSpeed,
    required this.recommendedSpeed,
    required this.isaState,
  });

  Color get _speedColor {
    switch (isaState) {
      case ISAState.normal:
      case ISAState.compliant:
        return AppColors.safe;
      case ISAState.advisory:
        return AppColors.warning;
      case ISAState.breach:
      case ISAState.critical:
        return AppColors.danger;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 90,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.7),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _speedColor.withOpacity(0.4), width: 1.2),
        boxShadow: [
          BoxShadow(color: _speedColor.withOpacity(0.2), blurRadius: 20),
        ],
      ),
      child: Column(
        children: [
          Text(
            '$currentSpeed',
            style: GoogleFonts.orbitron(
              fontSize: 36,
              fontWeight: FontWeight.w800,
              color: _speedColor,
              height: 1,
            ),
          ),
          Text(
            'km/h',
            style: GoogleFonts.inter(
              fontSize: 9.5,
              color: AppColors.textMuted,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 10),
          Container(height: 0.8, color: AppColors.border),
          const SizedBox(height: 8),
          Text(
            'LIMIT',
            style: GoogleFonts.inter(
              fontSize: 8.5,
              color: AppColors.textMuted,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            '$recommendedSpeed',
            style: GoogleFonts.orbitron(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.amber,
            ),
          ),
          Text(
            'km/h',
            style: GoogleFonts.inter(fontSize: 8.5, color: AppColors.textMuted),
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: (currentSpeed / 120).clamp(0.0, 1.0),
              backgroundColor: AppColors.border,
              valueColor: AlwaysStoppedAnimation(_speedColor),
              minHeight: 4,
            ),
          ),
        ],
      ),
    );
  }
}
