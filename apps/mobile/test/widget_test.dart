import 'package:flutter_test/flutter_test.dart';
import 'package:strayguard/main.dart';

void main() {
  testWidgets('StrayGuard app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const StrayGuardApp());
    expect(find.byType(StrayGuardApp), findsOneWidget);
  });
}
