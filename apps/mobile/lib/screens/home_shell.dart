import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import 'camera_screen.dart';
import 'zone_map_screen.dart';
import 'drive_history_screen.dart';
import 'detection_feed_screen.dart';
import 'settings_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});
  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  late final PageController _pageController;

  final List<_TabItem> _tabs = [
    _TabItem(
      icon: Icons.videocam_rounded,
      activeIcon: Icons.videocam,
      label: 'Camera',
    ),
    _TabItem(
      icon: Icons.map_outlined,
      activeIcon: Icons.map_rounded,
      label: 'Zones',
    ),
    _TabItem(
      icon: Icons.history_outlined,
      activeIcon: Icons.history_rounded,
      label: 'History',
    ),
    _TabItem(
      icon: Icons.bug_report_outlined,
      activeIcon: Icons.bug_report_rounded,
      label: 'Feed',
    ),
    _TabItem(
      icon: Icons.settings_outlined,
      activeIcon: Icons.settings_rounded,
      label: 'Settings',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onTabTap(int index) {
    HapticFeedback.selectionClick();
    setState(() => _currentIndex = index);
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      extendBody: true,
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: const [
          CameraScreen(),
          ZoneMapScreen(),
          DriveHistoryScreen(),
          DetectionFeedScreen(),
          SettingsScreen(),
        ],
      ),
      bottomNavigationBar: _FloatingBottomNav(
        currentIndex: _currentIndex,
        tabs: _tabs,
        onTap: _onTabTap,
      ),
    );
  }
}

class _TabItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  const _TabItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}

class _FloatingBottomNav extends StatelessWidget {
  final int currentIndex;
  final List<_TabItem> tabs;
  final ValueChanged<int> onTap;

  const _FloatingBottomNav({
    required this.currentIndex,
    required this.tabs,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).padding.bottom;
    return Container(
      height: 72 + bottom,
      decoration: BoxDecoration(
        color: AppColors.surface.withOpacity(0.92),
        border: const Border(
          top: BorderSide(color: AppColors.border, width: 0.8),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 24,
            offset: const Offset(0, -6),
          ),
          BoxShadow(
            color: AppColors.primary.withOpacity(0.04),
            blurRadius: 40,
            offset: const Offset(0, -10),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: tabs.asMap().entries.map((entry) {
            final i = entry.key;
            final tab = entry.value;
            final selected = i == currentIndex;
            return Expanded(
              child: GestureDetector(
                onTap: () => onTap(i),
                behavior: HitTestBehavior.opaque,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  curve: Curves.easeOut,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: selected
                              ? AppColors.primary.withOpacity(0.12)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: selected
                              ? Border.all(
                                  color: AppColors.primary.withOpacity(0.25),
                                  width: 1,
                                )
                              : null,
                        ),
                        child: Icon(
                          selected ? tab.activeIcon : tab.icon,
                          color: selected
                              ? AppColors.primary
                              : AppColors.textMuted,
                          size: 20,
                        ),
                      ),
                      const SizedBox(height: 3),
                      AnimatedDefaultTextStyle(
                        duration: const Duration(milliseconds: 200),
                        style: GoogleFonts.inter(
                          fontSize: 9.5,
                          fontWeight: selected
                              ? FontWeight.w700
                              : FontWeight.w400,
                          color: selected
                              ? AppColors.primary
                              : AppColors.textMuted,
                          letterSpacing: selected ? 0.4 : 0.1,
                        ),
                        child: Text(tab.label),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
