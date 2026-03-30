package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestion_IdOrderByOptionOrder(Long questionId);
}
