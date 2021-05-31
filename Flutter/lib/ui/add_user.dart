import 'package:Flutter/network/api.dart';
import 'package:flutter/material.dart';

class AddUser extends StatefulWidget {
  @override
  _AddUserState createState() => _AddUserState();
}

class _AddUserState extends State<AddUser> {
  String firstname;
  String lastname;
  String emailUsername;
  String password;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('New User'),),
      body: Center(child: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: <Widget>[

           // first name input
          TextField(
            decoration: InputDecoration(hintText: 'Enter first name',
            labelText: 'First Name'),
            onChanged: (value){
              setState(() {
                firstname = value;
              });
            },
          ),

          // last name input
          TextField(
            decoration: InputDecoration(hintText: 'Enter lastt name',
            labelText: 'Last Name'),
            onChanged: (value){
              setState(() {
                lastname = value;
              });
            },
          ),

          // email input
          TextField(
            decoration: InputDecoration(hintText: 'Enter email',
            labelText: 'Email'),
            onChanged: (value){
              setState(() {
                emailUsername = value;
              });
            },
          ),

          // password input
          TextField(
            decoration: InputDecoration(hintText: 'Enter password',
            labelText: 'Password'),
            onChanged: (value){
              setState(() {
                password = value;
              });
            },
          ),

          //Register button
          RaisedButton(child: Text('Register'),
          onPressed: () {
            API.createUser(firstname, lastname, emailUsername, password);
          },)
        ]),
      ),),
    );
  }
}