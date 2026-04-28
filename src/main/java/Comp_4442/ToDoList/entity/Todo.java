package Comp_4442.ToDoList.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "todos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String priority;

    @Column(name = "completed")
    @JsonProperty("isCompleted")
    private Boolean completed = false;

    @Column(name = "is_public")
    @JsonProperty("isPublic")
    private Boolean isPublic = false;

    @Column(name = "due_date")
    private java.time.LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_name")
    private String fileName;
}