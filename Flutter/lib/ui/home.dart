import 'package:flutter/material.dart';

import 'add_user.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    // home screen type is Scaffold
    return Scaffold(
      appBar: AppBar(title: Text('Flutter prototype for oxbridge'),),
      body: null,
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          // Navigate to the User Register page
          Navigator.push(context, MaterialPageRoute(builder: (context)=>AddUser()));
        },
        ),
    );
  }
}