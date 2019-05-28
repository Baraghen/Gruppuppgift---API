<?php

class User extends Mapper {

  // Gets user by their ID
  public function getUserByID($userID) {
    $statement = $this->db->prepare("SELECT * FROM users WHERE userID = :userID");
    $statement->execute([
      ':userID' => $userID
    ]);
    return $statement->fetch(PDO::FETCH_ASSOC);
  }

  // Gets all users from the DB
  public function getAllUsers() {
    $orderby = 'ASC';
    $statement = $this->db->prepare("SELECT * FROM users ORDER BY userID {$orderby}");
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

}
