import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import 'home_shell.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseCtrl;
  late AnimationController _scanCtrl;
  late AnimationController _progressCtrl;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _scanCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();
    _progressCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..forward();

    Future.delayed(const Duration(milliseconds: 3300), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (_, a, __) => const HomeShell(),
            transitionsBuilder: (_, anim, __, child) =>
                FadeTransition(opacity: anim, child: child),
            transitionDuration: const Duration(milliseconds: 600),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    _scanCtrl.dispose();
    _progressCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Radial glow background
          Container(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.center,
                radius: 0.85,
                colors: [
                  AppColors.primary.withOpacity(0.06),
                  AppColors.background,
                ],
              ),
            ),
          ),

          // Grid pattern
          CustomPaint(
            painter: _GridPainter(),
            size: MediaQuery.of(context).size,
          ),

          // Animated scan line
          AnimatedBuilder(
            animation: _scanCtrl,
            builder: (_, __) => CustomPaint(
              painter: _ScanPainter(_scanCtrl.value),
              size: MediaQuery.of(context).size,
            ),
          ),

          // Main content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo shield
                AnimatedBuilder(
                      animation: _pulseCtrl,
                      builder: (_, child) {
                        final glow = 0.3 + 0.7 * _pulseCtrl.value;
                        return Container(
                          width: 126,
                          height: 126,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primary.withOpacity(
                                  glow * 0.4,
                                ),
                                blurRadius: 60 * glow,
                                spreadRadius: 8 * glow,
                              ),
                            ],
                          ),
                          child: child,
                        );
                      },
                      child: Container(
                        width: 126,
                        height: 126,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              AppColors.primary.withOpacity(0.15),
                              AppColors.surfaceUp,
                            ],
                          ),
                          border: Border.all(
                            color: AppColors.primary.withOpacity(0.6),
                            width: 1.5,
                          ),
                        ),
                        child: const Icon(
                          Icons.shield_outlined,
                          size: 62,
                          color: AppColors.primary,
                        ),
                      ),
                    )
                    .animate()
                    .scale(
                      begin: const Offset(0.55, 0.55),
                      end: const Offset(1, 1),
                      duration: 750.ms,
                      curve: Curves.elasticOut,
                    )
                    .fadeIn(duration: 500.ms),

                const SizedBox(height: 30),

                // App name
                Text(
                      'StrayGuard',
                      style: GoogleFonts.orbitron(
                        fontSize: 38,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                        letterSpacing: 2,
                      ),
                    )
                    .animate(delay: 300.ms)
                    .slideY(begin: 0.3, end: 0, duration: 550.ms)
                    .fadeIn(duration: 500.ms),

                const SizedBox(height: 6),

                Text(
                  'MOBILE  ·  v3.0',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                    letterSpacing: 3.5,
                  ),
                ).animate(delay: 500.ms).fadeIn(duration: 450.ms),

                const SizedBox(height: 10),

                Text(
                  'AI Camera  ·  Intelligent Speed Assistance',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppColors.textMuted,
                    letterSpacing: 0.3,
                  ),
                ).animate(delay: 700.ms).fadeIn(duration: 450.ms),

                const SizedBox(height: 56),

                // Progress bar
                SizedBox(
                  width: 180,
                  child: Column(
                    children: [
                      AnimatedBuilder(
                        animation: _progressCtrl,
                        builder: (_, __) => Column(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: _progressCtrl.value,
                                backgroundColor: AppColors.border,
                                valueColor: AlwaysStoppedAnimation(
                                  AppColors.primary,
                                ),
                                minHeight: 2.5,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              _progressCtrl.value < 0.35
                                  ? 'Loading AI Engine…'
                                  : _progressCtrl.value < 0.7
                                  ? 'Syncing Hazard Zones…'
                                  : 'Starting Camera…',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: AppColors.textMuted,
                                letterSpacing: 0.8,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ).animate(delay: 900.ms).fadeIn(duration: 400.ms),
              ],
            ),
          ),

          // Bottom tag line
          Positioned(
            bottom: 34,
            left: 0,
            right: 0,
            child: Text(
              'Powered by TFLite · PostGIS · Firebase',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 10,
                color: AppColors.textMuted,
                letterSpacing: 0.8,
              ),
            ).animate(delay: 1200.ms).fadeIn(),
          ),
        ],
      ),
    );
  }
}

class _ScanPainter extends CustomPainter {
  final double t;
  _ScanPainter(this.t);
  @override
  void paint(Canvas canvas, Size size) {
    final y = t * size.height;
    canvas.drawRect(
      Rect.fromLTWH(0, y - 60, size.width, 120),
      Paint()
        ..shader = LinearGradient(
          colors: [
            Colors.transparent,
            AppColors.primary.withOpacity(0.06),
            AppColors.primary.withOpacity(0.12),
            AppColors.primary.withOpacity(0.06),
            Colors.transparent,
          ],
          stops: const [0, 0.3, 0.5, 0.7, 1],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ).createShader(Rect.fromLTWH(0, y - 60, size.width, 120)),
    );
  }

  @override
  bool shouldRepaint(_ScanPainter old) => old.t != t;
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.border.withOpacity(0.25)
      ..strokeWidth = 0.5;
    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(_GridPainter old) => false;
}
