package com.lensd.izge.repository;

import com.lensd.izge.entity.TestOturumEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestOturumRepository extends JpaRepository<TestOturumEntity, Long> {
    // Veritabanından tarih sırasına göre (en yeni en üstte) çekmek için:
    List<TestOturumEntity> findAllByOrderByOlusturulmaTarihiDesc();
}