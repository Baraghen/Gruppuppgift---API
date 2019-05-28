<?php

class Login extends Mapper {

    // Checks for the user in the database and if the password is correct
    public function loginUser($username, $password) {
    $statement = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $statement->execute([":username" => $username]);
        $user = $statement->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($password, $user["password"])) {
          $_SESSION["loggedIn"] = true;
          $_SESSION["userID"] = $user["userID"];
          $_SESSION["username"] = $user["username"];
          return ["userID" => $user["userID"], "username" => $user["username"]];
        } else {
            return $status = "error";
        }
    }

    // Registers user if the name isn't taken
    public function registerUser($username, $password){
        $statement = $this->db->prepare("SELECT COUNT(username) FROM users WHERE username = :username");
            $statement->execute([":username" => $username]);
            $count = $statement->fetchColumn();
            if($count > 0){
              return $status = "error";
            }
            else{
              $statement = $this->db->prepare(
                "INSERT INTO users (username, password)
                VALUES (:username, :password)"
              );
              $statement->execute([
                ":username" => $username,
                ":password" => password_hash($password, PASSWORD_BCRYPT)
              ]);
            }
    }
}
