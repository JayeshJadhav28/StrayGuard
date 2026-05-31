import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../services/backend_service.dart';

class MobileCameraView extends StatefulWidget {
  const MobileCameraView({super.key});

  @override
  State<MobileCameraView> createState() => _MobileCameraViewState();
}

class _MobileCameraViewState extends State<MobileCameraView> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();

    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.black)
      ..loadRequest(Uri.parse(BackendService.getVideoUiUrl()));
  }

  @override
  Widget build(BuildContext context) {
    return WebViewWidget(controller: controller);
  }
}
