package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EstudanteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Estudante getEstudanteSample1() {
        return new Estudante().id(1L).nomeEstudante("nomeEstudante1").email("email1").telefone("telefone1");
    }

    public static Estudante getEstudanteSample2() {
        return new Estudante().id(2L).nomeEstudante("nomeEstudante2").email("email2").telefone("telefone2");
    }

    public static Estudante getEstudanteRandomSampleGenerator() {
        return new Estudante()
            .id(longCount.incrementAndGet())
            .nomeEstudante(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .telefone(UUID.randomUUID().toString());
    }
}
