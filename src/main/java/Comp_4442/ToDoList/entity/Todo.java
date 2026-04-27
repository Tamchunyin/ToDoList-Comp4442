package Comp_4442.ToDoList.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "todos")
@Getter             // 自動生成所有欄位的 Getter
@Setter             // 自動生成所有欄位的 Setter
@NoArgsConstructor  // 自動生成無參數建構子 (JPA 必備)
@AllArgsConstructor // 自動生成全參數建構子
@Builder            // 支援流暢的 Builder 模式建立物件
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
}