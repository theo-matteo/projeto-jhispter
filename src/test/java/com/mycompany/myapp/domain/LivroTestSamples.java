package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LivroTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Livro getLivroSample1() {
        return new Livro().id(1L).titulo("titulo1").quantidade(1);
    }

    public static Livro getLivroSample2() {
        return new Livro().id(2L).titulo("titulo2").quantidade(2);
    }

    public static Livro getLivroRandomSampleGenerator() {
        return new Livro().id(longCount.incrementAndGet()).titulo(UUID.randomUUID().toString()).quantidade(intCount.incrementAndGet());
    }
}
