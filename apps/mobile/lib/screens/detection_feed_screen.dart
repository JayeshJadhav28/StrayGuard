import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';
import '../services/detection_storage.dart';

class DetectionFeedScreen extends StatefulWidget {
  const DetectionFeedScreen({super.key});

  @override
  State<DetectionFeedScreen> createState() =>
      _DetectionFeedScreenState();
}

class _DetectionFeedScreenState
    extends State<DetectionFeedScreen> {

  Timer? _refreshTimer;

  String? _selectedAnimal;

  @override
  void initState() {

    super.initState();

    _refreshTimer = Timer.periodic(
      const Duration(seconds: 1),
          (_) {

        if (mounted) {
          setState(() {});
        }
      },
    );
  }

  @override
  void dispose() {

    _refreshTimer?.cancel();

    super.dispose();
  }

  // ONLY UNIQUE ANIMALS
  List<DetectionRecord> get _events {

    final all =
        DetectionStorage.history;

    // REMOVE UNKNOWN
    final filtered = all.where((e) {

      return !e.animal
          .toLowerCase()
          .contains("unknown");

    }).toList();

    if (_selectedAnimal == null) {
      return filtered;
    }

    return filtered.where((e) {

      return e.animal.toLowerCase() ==
          _selectedAnimal!.toLowerCase();

    }).toList();
  }

  // UNIQUE ANIMAL FILTERS
  List<String> get _animals {

    final set = <String>{};

    for (final e in DetectionStorage.history) {

      if (!e.animal
          .toLowerCase()
          .contains("unknown")) {

        set.add(e.animal);
      }
    }

    return set.toList();
  }

  // TOTAL DETECTION COUNT
  int get _totalDetections {

    int total = 0;

    for (final e in DetectionStorage.history) {

      total += e.count;
    }

    return total;
  }

  @override
  Widget build(BuildContext context) {

    final events = _events;

    return Scaffold(

      backgroundColor:
      AppColors.background,

      body: Column(

        children: [

          _Header(
            totalCount:
            _totalDetections,
          ),

          _FilterBar(

            animals: _animals,

            selected:
            _selectedAnimal,

            onSelect: (v) {

              setState(() {

                _selectedAnimal = v;
              });
            },
          ),

          Expanded(

            child: events.isEmpty

                ? const _EmptyState()

                : ListView.builder(

              padding:
              const EdgeInsets.fromLTRB(
                16,
                12,
                16,
                100,
              ),

              itemCount:
              events.length,

              itemBuilder: (_, i) {

                final event =
                events[i];

                return _DetectionCard(

                  event: event,

                  isNew: i == 0,
                )
                    .animate(
                  delay:
                  (i * 40).ms,
                )
                    .slideY(
                  begin: 0.08,
                  end: 0,
                  duration: 240.ms,
                )
                    .fadeIn(
                  duration: 220.ms,
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

  final int totalCount;

  const _Header({
    required this.totalCount,
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

      decoration: BoxDecoration(

        color: AppColors.surface,

        border: const Border(

          bottom: BorderSide(
            color: AppColors.border,
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
            ),
          ),

          const SizedBox(width: 12),

          Column(

            crossAxisAlignment:
            CrossAxisAlignment.start,

            children: [

              Text(

                'Detection Feed',

                style:
                GoogleFonts.inter(

                  fontSize: 18,

                  fontWeight:
                  FontWeight.w700,

                  color:
                  AppColors.textPrimary,
                ),
              ),

              const SizedBox(height: 2),

              Text(

                '$totalCount total detections',

                style:
                GoogleFonts.inter(

                  fontSize: 11,

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

class _FilterBar extends StatelessWidget {

  final List<String> animals;

  final String? selected;

  final ValueChanged<String?> onSelect;

  const _FilterBar({

    required this.animals,

    required this.selected,

    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {

    return Container(

      height: 54,

      color: AppColors.surface,

      child: ListView(

        scrollDirection:
        Axis.horizontal,

        padding:
        const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 8,
        ),

        children: [

          _chip(
            label: "All",
            emoji: "🔍",
            active: selected == null,
            onTap: () => onSelect(null),
          ),

          ...animals.map((a) {

            final emoji =
            _emojiFor(a);

            return _chip(

              label: a,

              emoji: emoji,

              active:
              selected == a,

              onTap: () {

                onSelect(a);
              },
            );
          }),
        ],
      ),
    );
  }

  Widget _chip({

    required String label,

    required String emoji,

    required bool active,

    required VoidCallback onTap,
  }) {

    return GestureDetector(

      onTap: onTap,

      child: Container(

        margin:
        const EdgeInsets.only(
          right: 8,
        ),

        padding:
        const EdgeInsets.symmetric(
          horizontal: 14,
        ),

        decoration: BoxDecoration(

          color: active

              ? AppColors.primary
              .withOpacity(0.16)

              : AppColors.surfaceUp,

          borderRadius:
          BorderRadius.circular(20),

          border: Border.all(

            color: active

                ? AppColors.primary

                : AppColors.border,
          ),
        ),

        child: Row(

          children: [

            Text(
              emoji,
              style:
              const TextStyle(
                fontSize: 14,
              ),
            ),

            const SizedBox(width: 6),

            Text(

              label,

              style:
              GoogleFonts.inter(

                fontSize: 11.5,

                fontWeight:
                FontWeight.w600,

                color: active

                    ? AppColors.primary

                    : AppColors
                    .textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _emojiFor(String animal) {

    final a =
    animal.toLowerCase();

    if (a.contains("dog")) {
      return "🐕";
    }

    if (a.contains("cat")) {
      return "🐈";
    }

    if (a.contains("cow")) {
      return "🐄";
    }

    if (a.contains("goat")) {
      return "🐐";
    }

    if (a.contains("horse")) {
      return "🐎";
    }

    if (a.contains("human") ||
        a.contains("person")) {
      return "🧍";
    }

    if (a.contains("buffalo")) {
      return "🐃";
    }

    return "🐾";
  }
}

class _DetectionCard extends StatelessWidget {

  final DetectionRecord event;

  final bool isNew;

  const _DetectionCard({

    required this.event,

    required this.isNew,
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

    return Container(

      margin:
      const EdgeInsets.only(
        bottom: 12,
      ),

      padding:
      const EdgeInsets.all(14),

      decoration: BoxDecoration(

        color:
        isNew

            ? AppColors.primaryDeep
            .withOpacity(0.35)

            : AppColors.card,

        borderRadius:
        BorderRadius.circular(16),

        border: Border.all(

          color:
          isNew

              ? AppColors.primary
              .withOpacity(0.45)

              : AppColors.border,

          width:
          isNew ? 1.2 : 0.8,
        ),
      ),

      child: Row(

        children: [

          Container(

            width: 56,
            height: 56,

            decoration: BoxDecoration(

              color:
              AppColors.primary
                  .withOpacity(0.12),

              borderRadius:
              BorderRadius.circular(14),

              border: Border.all(

                color:
                AppColors.primary
                    .withOpacity(0.28),
              ),
            ),

            child: Center(

              child: Text(

                event.emoji,

                style:
                const TextStyle(
                  fontSize: 26,
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

                Row(

                  children: [

                    Expanded(

                      child: Text(

                        event.animal,

                        style:
                        GoogleFonts.inter(

                          fontSize: 15,

                          fontWeight:
                          FontWeight.w700,

                          color:
                          AppColors
                              .textPrimary,
                        ),
                      ),
                    ),

                    Container(

                      padding:
                      const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),

                      decoration: BoxDecoration(

                        color:
                        AppColors.primary
                            .withOpacity(0.12),

                        borderRadius:
                        BorderRadius.circular(20),
                      ),

                      child: Text(

                        'x${event.count}',

                        style:
                        GoogleFonts.inter(

                          fontSize: 11,

                          fontWeight:
                          FontWeight.w700,

                          color:
                          AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                Row(

                  children: [

                    const Icon(

                      Icons.location_on,

                      size: 14,

                      color:
                      AppColors.textMuted,
                    ),

                    const SizedBox(width: 4),

                    Expanded(

                      child: Text(

                        event.location,

                        style:
                        GoogleFonts.inter(

                          fontSize: 11,

                          color:
                          AppColors
                              .textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                Row(

                  children: [

                    Text(

                      _timeAgo(
                        event.time,
                      ),

                      style:
                      GoogleFonts.inter(

                        fontSize: 10.5,

                        color:
                        AppColors
                            .textMuted,
                      ),
                    ),

                    const Spacer(),

                    Container(

                      padding:
                      const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),

                      decoration: BoxDecoration(

                        color:
                        AppColors.primary
                            .withOpacity(0.1),

                        borderRadius:
                        BorderRadius.circular(
                          6,
                        ),
                      ),

                      child: Text(

                        '${((event.count / _getTotalCount()) * 100).toStringAsFixed(1)}% ratio',

                        style:
                        GoogleFonts.inter(

                          fontSize: 10,

                          fontWeight:
                          FontWeight.w600,

                          color:
                          AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  int _getTotalCount() {

    int total = 0;

    for (final e in DetectionStorage.history) {

      total += e.count;
    }

    return total == 0 ? 1 : total;
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

            Icons.search_off_rounded,

            size: 64,

            color:
            AppColors.textMuted,
          ),

          const SizedBox(height: 14),

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

            'Start camera detection',

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