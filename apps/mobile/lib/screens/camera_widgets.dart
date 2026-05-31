import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';
import '../models/detection_event.dart';

class TopHud extends StatelessWidget {
  final AnimationController recordDot;
  final bool isRecording;
  final bool isOnline;
  final int detectionCount;

  const TopHud({
    super.key,
    required this.recordDot,
    required this.isRecording,
    required this.isOnline,
    required this.detectionCount,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();

    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: EdgeInsets.only(
          top: MediaQuery.of(context).padding.top + 14,
          left: 18,
          right: 18,
          bottom: 18,
        ),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.black.withOpacity(0.82),
              Colors.black.withOpacity(0.18),
              Colors.transparent,
            ],
          ),
        ),
        child: Row(
          children: [
            AnimatedBuilder(
              animation: recordDot,
              builder: (_, __) => HudChip(
                label: isRecording ? 'REC' : 'PAUSED',
                color: isRecording
                    ? AppColors.danger
                    : AppColors.textMuted,
                leading: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isRecording
                        ? Color.lerp(
                      AppColors.danger,
                      Colors.redAccent,
                      recordDot.value,
                    )!
                        : AppColors.textMuted,
                    boxShadow: isRecording
                        ? [
                      BoxShadow(
                        color: AppColors.danger.withOpacity(0.8),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ]
                        : null,
                  ),
                ),
              ),
            ),

            const SizedBox(width: 10),

            HudChip(
              label: isOnline ? 'ONLINE' : 'OFFLINE',
              color: isOnline
                  ? AppColors.safe
                  : AppColors.warningGlow,
              icon: isOnline
                  ? Icons.signal_cellular_alt_rounded
                  : Icons.signal_cellular_off_rounded,
            ),

            const Spacer(),

            HudChip(
              label: '$detectionCount DETECTED',
              color: AppColors.primary,
              icon: Icons.pets_rounded,
            ),

            const SizedBox(width: 12),

            Text(
              '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}',
              style: GoogleFonts.orbitron(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class HudChip extends StatelessWidget {
  final String label;
  final Color color;
  final IconData? icon;
  final Widget? leading;

  const HudChip({
    super.key,
    required this.label,
    required this.color,
    this.icon,
    this.leading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 7,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.14),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: color.withOpacity(0.45),
          width: 1.1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: 12,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (leading != null) ...[
            leading!,
            const SizedBox(width: 6),
          ],

          if (icon != null) ...[
            Icon(
              icon,
              size: 14,
              color: color,
            ),
            const SizedBox(width: 5),
          ],

          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: color,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }
}

class DetectionToast extends StatelessWidget {
  final AnimalClass animalClass;

  const DetectionToast({
    super.key,
    required this.animalClass,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(
          sigmaX: 18,
          sigmaY: 18,
        ),
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 18,
            vertical: 14,
          ),
          decoration: BoxDecoration(
            color: AppColors.danger.withOpacity(0.16),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: AppColors.danger,
              width: 1.8,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.danger.withOpacity(0.45),
                blurRadius: 30,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: AppColors.danger.withOpacity(0.22),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: AppColors.danger.withOpacity(0.35),
                  ),
                ),
                child: Center(
                  child: Text(
                    animalClass.emoji,
                    style: const TextStyle(
                      fontSize: 30,
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 16),

              Expanded(
                child: Column(
                  crossAxisAlignment:
                  CrossAxisAlignment.start,
                  children: [
                    Text(
                      '⚠ FRONT OBSTACLE DETECTED',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppColors.danger,
                        letterSpacing: 1.4,
                      ),
                    ),

                    const SizedBox(height: 6),

                    Text(
                      animalClass.label.toUpperCase(),
                      style: GoogleFonts.inter(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),

                    const SizedBox(height: 3),

                    Text(
                      'Reduce speed immediately',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: AppColors.danger,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.danger.withOpacity(0.45),
                      blurRadius: 14,
                    ),
                  ],
                ),
                child: Text(
                  'ALERT',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 1.4,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    )
        .animate()
        .slideY(
      begin: -0.25,
      end: 0,
      duration: 320.ms,
      curve: Curves.easeOutCubic,
    )
        .fadeIn(duration: 250.ms);
  }
}

class BottomBar extends StatelessWidget {
  final bool isRecording;
  final bool cameraActive;
  final VoidCallback onToggleRecord;
  final VoidCallback onToggleCamera;

  const BottomBar({
    super.key,
    required this.isRecording,
    required this.cameraActive,
    required this.onToggleRecord,
    required this.onToggleCamera,
  });

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: EdgeInsets.only(
          bottom:
          MediaQuery.of(context).padding.bottom + 80,
          left: 22,
          right: 22,
          top: 18,
        ),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
            colors: [
              Colors.black.withOpacity(0.92),
              Colors.black.withOpacity(0.18),
              Colors.transparent,
            ],
          ),
        ),
        child: Row(
          mainAxisAlignment:
          MainAxisAlignment.spaceBetween,
          children: [
            GestureDetector(
              onTap: onToggleCamera,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: 13,
                ),
                decoration: BoxDecoration(
                  color: cameraActive
                      ? AppColors.primary.withOpacity(0.2)
                      : AppColors.glassBg,
                  borderRadius:
                  BorderRadius.circular(16),
                  border: Border.all(
                    color: cameraActive
                        ? AppColors.primary
                        .withOpacity(0.6)
                        : AppColors.glassBorder,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      cameraActive
                          ? Icons.videocam_rounded
                          : Icons.videocam_off_rounded,
                      size: 22,
                      color: cameraActive
                          ? AppColors.primary
                          : AppColors.textSecondary,
                    ),

                    const SizedBox(width: 8),

                    Text(
                      cameraActive
                          ? 'CAM ON'
                          : 'CAM OFF',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: cameraActive
                            ? AppColors.primary
                            : AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            GestureDetector(
              onTap: onToggleRecord,
              child: AnimatedContainer(
                duration:
                const Duration(milliseconds: 300),
                width: 74,
                height: 74,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: (isRecording
                      ? AppColors.danger
                      : AppColors.safe)
                      .withOpacity(0.18),
                  border: Border.all(
                    color: isRecording
                        ? AppColors.danger
                        : AppColors.safe,
                    width: 3,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: (isRecording
                          ? AppColors.danger
                          : AppColors.safe)
                          .withOpacity(0.4),
                      blurRadius: 24,
                    ),
                  ],
                ),
                child: Icon(
                  isRecording
                      ? Icons.stop_rounded
                      : Icons.play_arrow_rounded,
                  size: 34,
                  color: isRecording
                      ? AppColors.danger
                      : AppColors.safe,
                ),
              ),
            ),

            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment:
              CrossAxisAlignment.end,
              children: [
                Text(
                  'YOLOv8',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),

                const SizedBox(height: 4),

                Text(
                  'LIVE DETECTION',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textMuted,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}