package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AutorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Autor getAutorSample1() {
        return new Autor().id(1L).nomeAutor("nomeAutor1");
    }

    public static Autor getAutorSample2() {
        return new Autor().id(2L).nomeAutor("nomeAutor2");
    }

    public static Autor getAutorRandomSampleGenerator() {
        return new Autor().id(longCount.incrementAndGet()).nomeAutor(UUID.randomUUID().toString());
    }
}
