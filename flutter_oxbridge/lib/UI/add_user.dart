import 'package:flutter/material.dart';
import 'package:flutter_oxbridge/UI/Network/api.dart';

class AddUser extends StatefulWidget {
  @override
  _AddUserState createState() => _AddUserState();
}
class _AddUserState extends State<AddUser> {
  late String firstname;
  late String lastname;
  late String emailUsername;
  late String password ;
  //GlobalKey<ScaffoldState> key = GlobalKey<ScaffoldState>(); 
  final _formKey = GlobalKey<FormState>();
  bool hidePassword = true;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false, // this avoid bottom overflowed by pixels
      // key: key,
      appBar: AppBar(
         centerTitle: true,
        title: Text('Add New User'),
      ),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(children: <Widget>[
            // First name field
            TextFormField(
              decoration: InputDecoration(
                  hintText: 'Enter first name',
                  labelText: 'First Name',
                  prefixIcon: Icon(Icons.login)),
              keyboardType: TextInputType.text,
              onChanged: (value) {
                setState(() {
                  firstname = value;
                });
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Field should not be empty';
                }
              },
            ),

            // Last name field
            TextFormField(
              decoration: InputDecoration(
                  hintText: 'Enter last name',
                  labelText: 'Last Name',
                  prefixIcon: Icon(Icons.login)),
              keyboardType: TextInputType.text,
              onChanged: (value) {
                setState(() {
                  lastname = value;
                });
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Field should not be empty';
                }
              },
            ),

            // Email user name field
            TextFormField(
              decoration: InputDecoration(
                  hintText: 'Enter email',
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email)),
              keyboardType: TextInputType.emailAddress,
              onChanged: (value) {
                setState(() {
                  emailUsername = value;
                });
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Field should not be empty';
                }
              },
            ),

            // Password field
            TextFormField(
              decoration: InputDecoration(
                  hintText: 'Enter your password',
                  labelText: 'Password',
                  prefixIcon: Icon(Icons.lock)),
              keyboardType: TextInputType.text,
              obscureText: hidePassword,
              onChanged: (value) {
                setState(() {
                  password = value;
                });
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Field should not be empty';
                }
              },
            ),
            ElevatedButton(
              child: Text('Register'),
              onPressed: () {
                final ScaffoldMessengerState key = ScaffoldMessenger.of(context);
                 if (_formKey.currentState!.validate()) {  
                  API.createUser(firstname, lastname, emailUsername, password)
                  .then((user) => key.showSnackBar(SnackBar( content: Text(
                  'New user with id ${user.id} has been created'))));
                 }
              },
            )
          ]),
        ),
      ),
    );
  }
}
