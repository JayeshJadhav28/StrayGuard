import 'dart:io';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../services/backend_service.dart';

class WebCameraView extends StatefulWidget {
  const WebCameraView({super.key});

  @override
  State<WebCameraView> createState() =>
      _WebCameraViewState();
}

class _WebCameraViewState
    extends State<WebCameraView> {

  @override
  Widget build(BuildContext context) {

    // WINDOWS
    if (Platform.isWindows) {

      return Image.network(
        BackendService.getVideoUrl(),
        fit: BoxFit.cover,
        gaplessPlayback: true,
        filterQuality: FilterQuality.none,
      );
    }

    // ANDROID
    return const _AndroidCameraView();
  }
}

class _AndroidCameraView
    extends StatefulWidget {

  const _AndroidCameraView();

  @override
  State<_AndroidCameraView> createState() =>
      _AndroidCameraViewState();
}

class _AndroidCameraViewState
    extends State<_AndroidCameraView> {

  late final WebViewController controller;

  @override
  void initState() {
    super.initState();

    controller =
    WebViewController()

      ..setJavaScriptMode(
        JavaScriptMode.unrestricted,
      )

      ..setBackgroundColor(
        Colors.black,
      )

      ..enableZoom(false)

      ..loadHtmlString(
        '''
        <html>
        <head>
          <meta name="viewport"
          content="width=device-width,
          initial-scale=1.0,
          maximum-scale=1.0,
          user-scalable=no">

          <style>
            html, body {
              margin:0;
              padding:0;
              background:black;
              overflow:hidden;
              width:100%;
              height:100%;
            }

            img {
              width:100%;
              height:100%;
              object-fit:cover;
            }
          </style>
        </head>

        <body>
          <img src="${BackendService.getVideoUrl()}">
        </body>
        </html>
        ''',
      );
  }

  @override
  Widget build(BuildContext context) {

    return WebViewWidget(
      controller: controller,
    );
  }
}