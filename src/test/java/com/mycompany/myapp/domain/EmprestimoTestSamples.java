package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EmprestimoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Emprestimo getEmprestimoSample1() {
        return new Emprestimo().id(1L).status("status1");
    }

    public static Emprestimo getEmprestimoSample2() {
        return new Emprestimo().id(2L).status("status2");
    }

    public static Emprestimo getEmprestimoRandomSampleGenerator() {
        return new Emprestimo().id(longCount.incrementAndGet()).status(UUID.randomUUID().toString());
    }
}
