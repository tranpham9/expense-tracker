// Testing package
import 'package:flutter_test/flutter_test.dart';
import '../utility/helpers.dart';

void main() {
  // Ensure that the text matches the type it is. eg. Ensure an email follows email format
  test('Testing \'validateText\'', () {
    // setup (Input some strings and make sure the correct form is processed)
    String type = "password"; // The type you want to check
    String text = "kdsf\$sdfSDF123j@"; // The text you are checking
    // test
    expect(validateText(type, text), null);
  });

  // Ensure the button is only enabled when all of the requirements for the text are meet
  test('Testing \'disableButton\'', () {
    // set up
    List<String> errorTexts = ["Passwords must be 8 characters long"];
    List<String> textInputs = [""];
    // test
    expect(disableButton(errorTexts, textInputs), true);
  });
}
