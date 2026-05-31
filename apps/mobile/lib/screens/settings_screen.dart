import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  double _confidence = 0.55;
  bool _audioAlerts = true;
  bool _ttsAlerts = true;
  bool _vibration = true;
  bool _pushNotifications = true;
  bool _nightMode = true;
  bool _roiFilter = true;
  bool _offlineBuffer = true;
  String _speedUnit = 'km/h';
  String _modelVersion = 'MobileNet-SSD v2 INT8';
  double _fps = 4;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          _Header(),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 100),
              children: [
                // Profile card
                _ProfileCard()
                    .animate()
                    .fadeIn(duration: 400.ms)
                    .slideY(begin: 0.06, end: 0, duration: 380.ms),
                const SizedBox(height: 22),

                _SectionLabel('AI DETECTION'),
                _SliderTile(
                  icon: Icons.tune_rounded,
                  title: 'Confidence Threshold',
                  subtitle: 'Min confidence to trigger alert',
                  value: _confidence,
                  min: 0.3,
                  max: 0.9,
                  color: AppColors.primary,
                  valueLabel: '${(_confidence * 100).toInt()}%',
                  onChanged: (v) => setState(() => _confidence = v),
                ),
                _SliderTile(
                  icon: Icons.speed_rounded,
                  title: 'Inference FPS',
                  subtitle: 'Frames per second (affects battery)',
                  value: _fps,
                  min: 1,
                  max: 7,
                  color: AppColors.amber,
                  valueLabel: '${_fps.toInt()} fps',
                  onChanged: (v) => setState(() => _fps = v),
                ),
                _ToggleTile(
                  icon: Icons.crop_rounded,
                  title: 'ROI Filter',
                  subtitle: 'Ignore sky-band & far-lane detections',
                  value: _roiFilter,
                  color: AppColors.primary,
                  onChanged: (v) => setState(() => _roiFilter = v),
                ),
                _ToggleTile(
                  icon: Icons.nightlight_round,
                  title: 'Night Mode Enhancement',
                  subtitle: 'Boost sensitivity in low-light scenes',
                  value: _nightMode,
                  color: AppColors.amber,
                  onChanged: (v) => setState(() => _nightMode = v),
                ),

                const SizedBox(height: 22),
                _SectionLabel('ALERTS & NOTIFICATIONS'),
                _ToggleTile(
                  icon: Icons.volume_up_rounded,
                  title: 'Audio Alerts',
                  subtitle: 'Sound on animal detection & zone entry',
                  value: _audioAlerts,
                  color: AppColors.safe,
                  onChanged: (v) => setState(() => _audioAlerts = v),
                ),
                _ToggleTile(
                  icon: Icons.record_voice_over_rounded,
                  title: 'TTS Voice Warnings',
                  subtitle: 'Spoken alerts for speed breach events',
                  value: _ttsAlerts,
                  color: AppColors.safe,
                  onChanged: (v) => setState(() => _ttsAlerts = v),
                ),
                _ToggleTile(
                  icon: Icons.vibration_rounded,
                  title: 'Vibration',
                  subtitle: 'Haptic feedback on detection',
                  value: _vibration,
                  color: AppColors.safe,
                  onChanged: (v) => setState(() => _vibration = v),
                ),
                _ToggleTile(
                  icon: Icons.notifications_rounded,
                  title: 'Push Notifications',
                  subtitle: 'New critical zones on subscribed routes',
                  value: _pushNotifications,
                  color: AppColors.primary,
                  onChanged: (v) => setState(() => _pushNotifications = v),
                ),

                const SizedBox(height: 22),
                _SectionLabel('ISA & SPEED'),
                _PickerTile(
                  icon: Icons.straighten_rounded,
                  title: 'Speed Unit',
                  subtitle: 'Display unit for speed',
                  value: _speedUnit,
                  options: ['km/h', 'mph'],
                  color: AppColors.amber,
                  onChanged: (v) => setState(() => _speedUnit = v),
                ),

                const SizedBox(height: 22),
                _SectionLabel('DATA & CONNECTIVITY'),
                _ToggleTile(
                  icon: Icons.cloud_upload_rounded,
                  title: 'Offline Event Buffer',
                  subtitle: 'Store up to 500 detections when offline',
                  value: _offlineBuffer,
                  color: AppColors.primary,
                  onChanged: (v) => setState(() => _offlineBuffer = v),
                ),

                const SizedBox(height: 22),
                _SectionLabel('MODEL & APP'),
                _InfoTile(
                  icon: Icons.memory_rounded,
                  title: 'Active Model',
                  value: _modelVersion,
                  color: AppColors.primary,
                ),
                _InfoTile(
                  icon: Icons.data_usage_rounded,
                  title: 'Model Size',
                  value: '4.2 MB (INT8)',
                  color: AppColors.textSecondary,
                ),
                _InfoTile(
                  icon: Icons.verified_rounded,
                  title: 'App Version',
                  value: 'StrayGuard v3.0.0',
                  color: AppColors.textSecondary,
                ),
                _InfoTile(
                  icon: Icons.cloud_done_rounded,
                  title: 'Backend Status',
                  value: '✓ Connected  ·  API v1',
                  color: AppColors.safe,
                ),
                _PickerTile(
                  icon: Icons.model_training_rounded,
                  title: 'Detection Model',
                  subtitle: 'Switch inference model',
                  value: _modelVersion,
                  options: ['MobileNet-SSD v2 INT8', 'YOLO-nano v8 INT8'],
                  color: AppColors.primary,
                  onChanged: (v) => setState(() => _modelVersion = v),
                ),

                const SizedBox(height: 22),
                _SectionLabel('ABOUT'),
                _AboutCard(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Header extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 14,
        left: 20,
        right: 20,
        bottom: 14,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: const Border(
          bottom: BorderSide(color: AppColors.border, width: 0.8),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: AppColors.textMuted.withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.border),
            ),
            child: const Icon(
              Icons.settings_rounded,
              color: AppColors.textSecondary,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            'Settings',
            style: GoogleFonts.inter(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primary.withOpacity(0.08), AppColors.surfaceUp],
        ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.primary.withOpacity(0.25)),
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.07), blurRadius: 24),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [AppColors.primary, AppColors.primaryDim],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.4),
                  blurRadius: 14,
                ),
              ],
            ),
            child: const Icon(
              Icons.shield_outlined,
              color: Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'StrayGuard Driver',
                  style: GoogleFonts.inter(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  'sg_a3f7b2…',
                  style: GoogleFonts.robotoMono(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _Badge('v3.0.0', AppColors.primary),
                    const SizedBox(width: 6),
                    _Badge('142 events contributed', AppColors.safe),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color color;
  const _Badge(this.label, this.color);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(
      color: color.withOpacity(0.12),
      borderRadius: BorderRadius.circular(6),
      border: Border.all(color: color.withOpacity(0.3)),
    ),
    child: Text(
      label,
      style: GoogleFonts.inter(
        fontSize: 10,
        fontWeight: FontWeight.w700,
        color: color,
      ),
    ),
  );
}

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel(this.label);
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 10, left: 2),
    child: Row(
      children: [
        Container(
          width: 3,
          height: 12,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: AppColors.textMuted,
            letterSpacing: 1.3,
          ),
        ),
      ],
    ),
  );
}

class _ToggleTile extends StatelessWidget {
  final IconData icon;
  final String title, subtitle;
  final bool value;
  final Color color;
  final ValueChanged<bool> onChanged;
  const _ToggleTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.color,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: value ? color.withOpacity(0.18) : AppColors.border,
          width: 0.8,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(value ? 0.14 : 0.06),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: value ? color : AppColors.textMuted,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    fontSize: 10.5,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: color,
            activeTrackColor: color.withOpacity(0.22),
            inactiveThumbColor: AppColors.textMuted,
            inactiveTrackColor: AppColors.surfaceUp,
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
        ],
      ),
    );
  }
}

class _SliderTile extends StatelessWidget {
  final IconData icon;
  final String title, subtitle, valueLabel;
  final double value, min, max;
  final Color color;
  final ValueChanged<double> onChanged;
  const _SliderTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.min,
    required this.max,
    required this.color,
    required this.valueLabel,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 8),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border, width: 0.8),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: GoogleFonts.inter(
                        fontSize: 10.5,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                valueLabel,
                style: GoogleFonts.orbitron(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: color,
                ),
              ),
            ],
          ),
          SliderTheme(
            data: SliderThemeData(
              trackHeight: 2.5,
              activeTrackColor: color,
              inactiveTrackColor: AppColors.border,
              thumbColor: color,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6.5),
              overlayShape: const RoundSliderOverlayShape(overlayRadius: 13),
              overlayColor: color.withOpacity(0.14),
            ),
            child: Slider(
              value: value,
              min: min,
              max: max,
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }
}

class _PickerTile extends StatelessWidget {
  final IconData icon;
  final String title, value;
  final String? subtitle;
  final List<String> options;
  final Color color;
  final ValueChanged<String> onChanged;
  const _PickerTile({
    required this.icon,
    required this.title,
    required this.value,
    this.subtitle,
    required this.options,
    required this.color,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border, width: 0.8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (subtitle != null)
                      Text(
                        subtitle!,
                        style: GoogleFonts.inter(
                          fontSize: 10.5,
                          color: AppColors.textMuted,
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: options.map((o) {
              final isSelected = o == value;
              return Expanded(
                child: GestureDetector(
                  onTap: () => onChanged(o),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.only(right: 6),
                    padding: const EdgeInsets.symmetric(vertical: 9),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? color.withOpacity(0.16)
                          : AppColors.surfaceUp,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isSelected ? color : AppColors.border,
                        width: isSelected ? 1.5 : 0.8,
                      ),
                    ),
                    child: Text(
                      o,
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: isSelected
                            ? FontWeight.w700
                            : FontWeight.w500,
                        color: isSelected ? color : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String title, value;
  final Color color;
  const _InfoTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.color,
  });
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border, width: 0.8),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondary,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class _AboutCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border, width: 0.8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.shield_outlined,
                  color: AppColors.primary,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              Text(
                'StrayGuard Mobile v3.0',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'AI Camera + Intelligent Speed Assistance for stray animal road safety. '
            'All detection events are anonymised before upload. No personal data is stored or transmitted.',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: AppColors.textMuted,
              height: 1.55,
            ),
          ),
          const SizedBox(height: 14),
          Container(height: 0.8, color: AppColors.border),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _Link('Privacy Policy', Icons.privacy_tip_outlined),
              _Link('Terms of Use', Icons.gavel_rounded),
              _Link('Licences', Icons.source_rounded),
            ],
          ),
          const SizedBox(height: 14),
          Center(
            child: Text(
              'Powered by TFLite · PostGIS · Firebase',
              style: GoogleFonts.inter(
                fontSize: 10,
                color: AppColors.textMuted,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Link extends StatelessWidget {
  final String label;
  final IconData icon;
  const _Link(this.label, this.icon);
  @override
  Widget build(BuildContext context) => Column(
    children: [
      Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.surfaceUp,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: AppColors.textMuted, size: 17),
      ),
      const SizedBox(height: 5),
      Text(
        label,
        style: GoogleFonts.inter(fontSize: 10.5, color: AppColors.textMuted),
      ),
    ],
  );
}
