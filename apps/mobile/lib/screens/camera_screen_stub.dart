import 'package:flutter/material.dart';
import 'package:webview_windows/webview_windows.dart';

import '../services/backend_service.dart';

class CameraScreenStub extends StatefulWidget {
  const CameraScreenStub({super.key});

  @override
  State<CameraScreenStub> createState() => _CameraScreenStubState();
}

class _CameraScreenStubState extends State<CameraScreenStub> {
  final WebviewController controller = WebviewController();

  bool loading = true;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    await controller.initialize();

    await controller.loadUrl(BackendService.getVideoUiUrl());

    if (mounted) {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        if (!loading) Webview(controller),

        if (loading) const Center(child: CircularProgressIndicator()),
      ],
    );
  }
}
