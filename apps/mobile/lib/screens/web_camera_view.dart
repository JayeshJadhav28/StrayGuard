import 'dart:io';

import 'package:flutter/material.dart';

import 'camera_screen_mobile.dart';
import 'camera_screen_stub.dart';

class WebCameraView extends StatelessWidget {
  const WebCameraView({super.key});

  @override
  Widget build(BuildContext context) {

    if (Platform.isWindows) {
      return const CameraScreenStub();
    }

    return const MobileCameraView();
  }
}