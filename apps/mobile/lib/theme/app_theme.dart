import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Deep navy base — inspired by CiviLytix / STS Labs dark intelligence dashboards
  static const Color background = Color(0xFF040810);
  static const Color surface = Color(0xFF080E1A);
  static const Color surfaceUp = Color(0xFF0C1422);
  static const Color card = Color(0xFF0F1928);
  static const Color cardHover = Color(0xFF141F32);
  // Backwards-compat alias
  static const Color surfaceVariant = Color(0xFF0C1422);

  // Electric teal/cyan primary — QRoadScan / RoadAthena intelligence accent
  static const Color primary = Color(0xFF00D4FF);
  static const Color primaryDim = Color(0xFF0099BB);
  static const Color primaryGlow = Color(0x3000D4FF);
  static const Color primaryDeep = Color(0xFF003A4A);

  // Secondary amber — ISA / speed warning
  static const Color amber = Color(0xFFFFAB00);
  static const Color amberGlow = Color(0x30FFAB00);

  // Status
  static const Color safe = Color(0xFF00E5A0);
  static const Color safeGlow = Color(0x2500E5A0);
  static const Color warning = Color(0xFFFFAB00);
  static const Color warningGlow = Color(0x30FFAB00);
  static const Color danger = Color(0xFFFF3D5A);
  static const Color dangerGlow = Color(0x30FF3D5A);
  static const Color critical = Color(0xFFD50000);

  // Text
  static const Color textPrimary = Color(0xFFEEF4FF);
  static const Color textSecondary = Color(0xFF7A93B8);
  static const Color textMuted = Color(0xFF3D5270);

  // Borders
  static const Color border = Color(0xFF182436);
  static const Color borderBright = Color(0xFF1E3050);
  static const Color glassBorder = Color(0x20FFFFFF);

  // Glass / HUD
  static const Color hudBg = Color(0xCC040810);
  static const Color glassBg = Color(0x12FFFFFF);
  static const Color glassBgStrong = Color(0x1AFFFFFF);

  // Risk levels
  static const Color riskLow = Color(0xFF00E5A0);
  static const Color riskMedium = Color(0xFFFFD600);
  static const Color riskHigh = Color(0xFFFF6D00);
  static const Color riskCritical = Color(0xFFFF3D5A);
}

class AppTheme {
  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.amber,
        surface: AppColors.surface,
        onPrimary: Colors.black,
        onSurface: AppColors.textPrimary,
      ),
      textTheme: GoogleFonts.interTextTheme(
        const TextTheme(
          displayLarge: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w700,
          ),
          displayMedium: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w700,
          ),
          headlineLarge: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w700,
          ),
          headlineMedium: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
          headlineSmall: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
          titleLarge: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
          titleMedium: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w500,
          ),
          bodyLarge: TextStyle(color: AppColors.textSecondary),
          bodyMedium: TextStyle(color: AppColors.textSecondary),
          bodySmall: TextStyle(color: AppColors.textMuted),
          labelLarge: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          color: AppColors.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),
    );
  }
}

class HudTextStyle {
  static TextStyle speed({
    double size = 64,
    Color color = AppColors.textPrimary,
  }) => GoogleFonts.orbitron(
    fontSize: size,
    fontWeight: FontWeight.w700,
    color: color,
    letterSpacing: -1,
  );

  static TextStyle label({
    double size = 11,
    Color color = AppColors.textSecondary,
  }) => GoogleFonts.inter(
    fontSize: size,
    fontWeight: FontWeight.w500,
    color: color,
    letterSpacing: 1.2,
  );

  static TextStyle value({
    double size = 16,
    Color color = AppColors.textPrimary,
  }) => GoogleFonts.inter(
    fontSize: size,
    fontWeight: FontWeight.w600,
    color: color,
  );
}
