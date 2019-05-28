<?php

class Entry extends Mapper {
  public function getEntriesByUser($userID) {
    $orderby = 'DESC';
    $statement = $this->db->prepare("SELECT * FROM entries WHERE createdBy = :userID ORDER BY createdAt {$orderby}");
    $statement->bindParam(':userID', $userID, PDO::PARAM_INT);
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // Get x-amount of entries from DB
  public function getSomeEntries($num){
    $orderby = 'DESC';
    $statement = $this->db->prepare("SELECT * FROM entries ORDER BY createdAt {$orderby} LIMIT :num");
    $statement->bindParam(':num', $num, PDO::PARAM_INT);
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // Get all entries from DB
  public function getAllEntries(){
    $orderby = 'DESC';
    $statement = $this->db->prepare("SELECT * FROM entries ORDER BY createdAt {$orderby}");
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // Add entry
  public function addEntry($title, $content) {
    $statement = $this->db->prepare("INSERT INTO entries (title, content, createdBy, createdAt)
      VALUES (:title, :content, :createdBy, :createdAt)");
      $statement->bindParam(':title', $title);
      $statement->bindParam(':content', $content);
      $statement->bindParam(':createdBy', $_SESSION["userID"], PDO::PARAM_INT);
      $statement->bindParam(':createdAt', date('Y-m-d H:i:s'));
      $statement->execute();
  }

  // Delete entry
  public function deleteEntry($id){
    $statement = $this->db->prepare("DELETE FROM entries WHERE entryID = :id");
    $statement->bindParam(':id', $id, PDO::PARAM_INT);
    $statement->execute();
  }

  // Edit entry
  public function editEntry($id, $title, $content){
    $statement = $this->db->prepare("UPDATE entries SET title = :title, content = :content, createdAt = :createdAt WHERE entryID = :id");
    $statement->bindParam(':title', $title);
    $statement->bindParam(':content', $content);
    $statement->bindParam(':createdAt', date('Y-m-d H:i:s'));
    $statement->bindParam(':id', $id, PDO::PARAM_INT);
    $statement->execute();
  }

  // Get entry by ID
  public function getEntry($id){
    $statement = $this->db->prepare("SELECT * FROM entries WHERE entryID = :id");
    $statement->bindParam(':id', $id, PDO::PARAM_INT);
    $statement->execute();
    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
