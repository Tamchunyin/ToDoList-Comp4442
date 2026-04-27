package Comp_4442.ToDoList.repository;

import Comp_4442.ToDoList.entity.Todo;
import Comp_4442.ToDoList.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserOrIsPublicTrue(User user);
    List<Todo> findByUser(User user);
    List<Todo> findByIsPublicTrue();

}
