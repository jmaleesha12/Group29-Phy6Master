
// ... existing code ...
public interface LearningMaterialRepository extends JpaRepository<LearningMaterial, Long> {
    @Query("SELECT m FROM LearningMaterial m JOIN FETCH m.lesson WHERE m.lesson.course.id = :courseId")
    List<LearningMaterial> findByCourseId(Long courseId);

    List<LearningMaterial> findByLesson(com.example.Phy6_Master.model.Lesson lesson);

    List<LearningMaterial> findByLessonId(Long lessonId);
}
