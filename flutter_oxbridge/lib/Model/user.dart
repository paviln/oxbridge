class User {
  int id;
  String firstname;
  String lastname;
  String emailUsername;
  String password;

  User(
      {
      required this.id,
      required this.firstname,
      required this.lastname,
      required this.emailUsername,
      required this.password});

  factory User.fromJson(Map<String, dynamic> user) => User( id: user['id'],
      firstname: user['firstname'],
      lastname: user['lastname'],
      emailUsername: user['email'],
      password: user['password']);
   
     
    
  }

