import 'package:flutter/material.dart';
import 'package:flutter_oxbridge/ui/home.dart';
//import 'form.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Register',
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
      debugShowCheckedModeBanner: false, // this remove debug banner
      home: Home(),
    );
  }
}
