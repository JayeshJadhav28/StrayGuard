import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../theme/app_theme.dart';
import '../services/detection_storage.dart';

class DriveHistoryScreen extends StatefulWidget {
  const DriveHistoryScreen({super.key});

  @override
  State<DriveHistoryScreen> createState() =>
      _DriveHistoryScreenState();
}

class _DriveHistoryScreenState
    extends State<DriveHistoryScreen> {

  int _selectedIdx = -1;

  List<DetectionRecord> get _history {

    return DetectionStorage.history.where((e) {

      return !e.animal
          .toLowerCase()
          .contains("unknown");

    }).toList();
  }

  int get _totalDetections {

    int total = 0;

    for (final item in _history) {
      total += item.count;
    }

    return total;
  }

  @override
  Widget build(BuildContext context) {

    final history = _history;

    return Scaffold(

      backgroundColor:
      AppColors.background,

      body: Column(

        children: [

          _Header(
            total:
            _totalDetections,
          ),

          _StatsPanel(
            totalDetections:
            _totalDetections,
          ),

          Expanded(

            child: history.isEmpty

                ? const _EmptyState()

                : ListView.builder(

              padding:
              const EdgeInsets.fromLTRB(
                  16,
                  10,
                  16,
                  100
              ),

              itemCount:
              history.length,

              itemBuilder: (_, i) {

                return _DetectionCard(

                  detection:
                  history[i],

                  isExpanded:
                  _selectedIdx == i,

                  index: i,

                  onTap: () {

                    setState(() {

                      _selectedIdx =
                      _selectedIdx == i
                          ? -1
                          : i;
                    });
                  },
                )
                    .animate(
                  delay:
                  (i * 55).ms,
                )
                    .slideX(
                  begin: 0.04,
                  end: 0,
                  duration:
                  300.ms,
                )
                    .fadeIn(
                  duration:
                  280.ms,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _Header extends StatelessWidget {

  final int total;

  const _Header({
    required this.total,
  });

  @override
  Widget build(BuildContext context) {

    return Container(

      padding: EdgeInsets.only(

        top:
        MediaQuery.of(context)
            .padding
            .top +
            14,

        left: 20,
        right: 20,
        bottom: 14,
      ),

      decoration: const BoxDecoration(

        color:
        AppColors.surface,

        border: Border(

          bottom: BorderSide(
            color:
            AppColors.border,
            width: 0.8,
          ),
        ),
      ),

      child: Row(

        children: [

          Container(

            width: 42,
            height: 42,

            decoration: BoxDecoration(

              color:
              AppColors.primary
                  .withOpacity(0.12),

              borderRadius:
              BorderRadius.circular(12),

              border: Border.all(

                color:
                AppColors.primary
                    .withOpacity(0.25),
              ),
            ),

            child: const Icon(

              Icons.history_rounded,

              color:
              AppColors.primary,

              size: 22,
            ),
          ),

          const SizedBox(width: 14),

          Column(

            crossAxisAlignment:
            CrossAxisAlignment.start,

            children: [

              Text(

                'Detection History',

                style:
                GoogleFonts.inter(

                  fontSize: 20,

                  fontWeight:
                  FontWeight.w700,

                  color:
                  AppColors.textPrimary,
                ),
              ),

              const SizedBox(height: 2),

              Text(

                '$total confirmed detections',

                style:
                GoogleFonts.inter(

                  fontSize: 12,

                  color:
                  AppColors.textMuted,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatsPanel extends StatelessWidget {

  final int totalDetections;

  const _StatsPanel({
    required this.totalDetections,
  });

  @override
  Widget build(BuildContext context) {

    return Container(

      color:
      AppColors.surface,

      padding:
      const EdgeInsets.fromLTRB(
          14,
          0,
          14,
          14
      ),

      child: Container(

        width: double.infinity,

        padding:
        const EdgeInsets.symmetric(
          vertical: 18,
          horizontal: 18,
        ),

        decoration: BoxDecoration(

          color:
          AppColors.primary
              .withOpacity(0.08),

          borderRadius:
          BorderRadius.circular(18),

          border: Border.all(

            color:
            AppColors.primary
                .withOpacity(0.25),
          ),
        ),

        child: Row(

          children: [

            Icon(

              Icons.pets_rounded,

              color:
              AppColors.primary,

              size: 30,
            ),

            const SizedBox(width: 14),

            Column(

              crossAxisAlignment:
              CrossAxisAlignment.start,

              children: [

                Text(

                  '$totalDetections',

                  style:
                  GoogleFonts.orbitron(

                    fontSize: 34,

                    fontWeight:
                    FontWeight.w800,

                    color:
                    AppColors.primary,
                  ),
                ),

                Text(

                  'CONFIRMED DETECTIONS',

                  style:
                  GoogleFonts.inter(

                    fontSize: 11,

                    fontWeight:
                    FontWeight.w700,

                    letterSpacing: 1.1,

                    color:
                    AppColors.textMuted,
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

class _DetectionCard extends StatelessWidget {

  final DetectionRecord detection;

  final bool isExpanded;

  final int index;

  final VoidCallback onTap;

  const _DetectionCard({

    required this.detection,

    required this.isExpanded,

    required this.index,

    required this.onTap,
  });

  String _timeAgo(DateTime dt) {

    final diff =
    DateTime.now().difference(dt);

    if (diff.inSeconds < 60) {
      return '${diff.inSeconds}s ago';
    }

    if (diff.inMinutes < 60) {
      return '${diff.inMinutes}m ago';
    }

    if (diff.inHours < 24) {
      return '${diff.inHours}h ago';
    }

    return '${diff.inDays}d ago';
  }

  @override
  Widget build(BuildContext context) {

    return GestureDetector(

      onTap: onTap,

      child: AnimatedContainer(

        duration:
        const Duration(milliseconds: 300),

        margin:
        const EdgeInsets.only(
            bottom: 14
        ),

        decoration: BoxDecoration(

          color:
          AppColors.card,

          borderRadius:
          BorderRadius.circular(20),

          border: Border.all(

            color: isExpanded

                ? AppColors.primary
                .withOpacity(0.4)

                : AppColors.border,

            width:
            isExpanded ? 1.5 : 0.8,
          ),
        ),

        child: Column(

          children: [

            Padding(

              padding:
              const EdgeInsets.all(16),

              child: Row(

                children: [

                  Container(

                    width: 58,
                    height: 58,

                    decoration: BoxDecoration(

                      color:
                      AppColors.primary
                          .withOpacity(0.12),

                      borderRadius:
                      BorderRadius.circular(16),
                    ),

                    child: Center(

                      child: Text(

                        detection.emoji,

                        style:
                        const TextStyle(
                          fontSize: 30,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 14),

                  Expanded(

                    child: Column(

                      crossAxisAlignment:
                      CrossAxisAlignment.start,

                      children: [

                        Text(

                          detection.animal,

                          style:
                          GoogleFonts.inter(

                            fontSize: 16,

                            fontWeight:
                            FontWeight.w700,

                            color:
                            AppColors.textPrimary,
                          ),
                        ),

                        const SizedBox(height: 6),

                        Text(

                          '${detection.count} detections',

                          style:
                          GoogleFonts.inter(

                            fontSize: 13,

                            fontWeight:
                            FontWeight.w600,

                            color:
                            AppColors.primary,
                          ),
                        ),

                        const SizedBox(height: 6),

                        Text(

                          detection.location,

                          maxLines: 1,

                          overflow:
                          TextOverflow.ellipsis,

                          style:
                          GoogleFonts.inter(

                            fontSize: 11.5,

                            color:
                            AppColors.textSecondary,
                          ),
                        ),

                        const SizedBox(height: 6),

                        Text(

                          _timeAgo(
                            detection.time,
                          ),

                          style:
                          GoogleFonts.inter(

                            fontSize: 10,

                            color:
                            AppColors.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),

                  AnimatedRotation(

                    turns:
                    isExpanded ? 0.5 : 0,

                    duration:
                    const Duration(
                        milliseconds: 250
                    ),

                    child: const Icon(

                      Icons
                          .keyboard_arrow_down_rounded,

                      color:
                      AppColors.textMuted,

                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            if (isExpanded) ...[

              Container(
                height: 0.8,
                color: AppColors.border,
              ),

              Padding(

                padding:
                const EdgeInsets.all(16),

                child: Column(

                  children: [

                    _InfoRow(
                      'Animal',
                      detection.animal,
                    ),

                    _InfoRow(
                      'Total Detections',
                      detection.count.toString(),
                    ),

                    _InfoRow(
                      'Last Location',
                      detection.location,
                    ),

                    _InfoRow(
                      'Last Detected',
                      DateFormat(
                        'dd MMM yyyy • HH:mm:ss',
                      ).format(
                        detection.time,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {

  final String label;
  final String value;

  const _InfoRow(
      this.label,
      this.value,
      );

  @override
  Widget build(BuildContext context) {

    return Padding(

      padding:
      const EdgeInsets.only(
          bottom: 12
      ),

      child: Row(

        children: [

          Text(

            label,

            style:
            GoogleFonts.inter(

              fontSize: 12,

              color:
              AppColors.textMuted,
            ),
          ),

          const Spacer(),

          Flexible(

            child: Text(

              value,

              textAlign:
              TextAlign.right,

              style:
              GoogleFonts.inter(

                fontSize: 12,

                fontWeight:
                FontWeight.w600,

                color:
                AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {

  const _EmptyState();

  @override
  Widget build(BuildContext context) {

    return Center(

      child: Column(

        mainAxisAlignment:
        MainAxisAlignment.center,

        children: [

          const Icon(

            Icons.history_toggle_off_rounded,

            size: 70,

            color:
            AppColors.textMuted,
          ),

          const SizedBox(height: 16),

          Text(

            'No detections yet',

            style:
            GoogleFonts.inter(

              fontSize: 16,

              fontWeight:
              FontWeight.w600,

              color:
              AppColors.textMuted,
            ),
          ),

          const SizedBox(height: 4),

          Text(

            'Confirmed detections will appear here',

            style:
            GoogleFonts.inter(

              fontSize: 12.5,

              color:
              AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}