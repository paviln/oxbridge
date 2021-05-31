import 'package:flutter/material.dart';
import 'add_user.dart';
import 'eventPage.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    // home screen type is Scaffold
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text('THE OXBRIDGE RACE'),
      ),
    
     floatingActionButton: Wrap( //will break to another line on overflow
                  direction: Axis.horizontal, //use vertical to show  on vertical axis
                  children: <Widget>[
                        Container( 
                          margin:EdgeInsets.all(10),
                          child: FloatingActionButton.extended(  
                          onPressed: () {
                            Navigator.push(
                            context, MaterialPageRoute(builder: (context) => ShowEvent()));
                          },  
                          icon: Icon(Icons.event),  
                          label: Text("EVENTS"), 
                          )
                        ), //button first

                        Container( 
                          margin:EdgeInsets.all(10),
                          child:  FloatingActionButton.extended(  
                          onPressed: () {
                            Navigator.push(
                            context, MaterialPageRoute(builder: (context) => AddUser()));
                          },  
                          icon: Icon(Icons.add),  
                          label: Text("ADD"), 
                            
                          )
                        ), // button second

                ],
            ),
    );
  }
}
